#!/usr/bin/env python3
"""
Directory Data Collection Script
Automatically collect business data from multiple APIs with minimal manual work
"""

import googlemaps
import requests
import pandas as pd
import os
import json
import time
from dotenv import load_dotenv
from datetime import datetime
from typing import List, Dict, Tuple
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

class DirectoryDataCollector:
    """Collect business data from multiple APIs"""
    
    def __init__(self):
        """Initialize API clients"""
        self.gmaps = googlemaps.Client(key=os.getenv('GOOGLE_PLACES_API_KEY'))
        self.yelp_key = os.getenv('YELP_API_KEY')
        self.hunter_key = os.getenv('HUNTER_API_KEY')
        self.apollo_key = os.getenv('APOLLO_API_KEY')
        self.stats = {
            'google': 0,
            'yelp': 0,
            'hunter': 0,
            'duplicates_removed': 0,
            'final_count': 0
        }
    
    def collect_google_places(self, location: Tuple[float, float], 
                             search_type: str, max_results: int = 500) -> List[Dict]:
        """
        Collect business data from Google Places API
        
        Args:
            location: Tuple of (latitude, longitude)
            search_type: Type of business (e.g., 'plumber', 'restaurant')
            max_results: Maximum number of results to collect
        
        Returns:
            List of business dictionaries
        """
        logger.info(f"Collecting from Google Places: {search_type}")
        
        results = []
        next_page_token = None
        
        try:
            while len(results) < max_results:
                if next_page_token:
                    time.sleep(2)  # Wait for token to become valid
                
                places_result = self.gmaps.places_nearby(
                    location=location,
                    radius=5000,
                    type=search_type,
                    page_token=next_page_token
                )
                
                for place in places_result['results']:
                    business = {
                        'source': 'google',
                        'name': place.get('name', ''),
                        'address': place.get('vicinity', ''),
                        'phone': place.get('formatted_phone_number', ''),
                        'rating': place.get('rating', ''),
                        'review_count': place.get('user_ratings_total', ''),
                        'website': place.get('website', ''),
                        'place_id': place.get('place_id', ''),
                        'types': ','.join(place.get('types', []))
                    }
                    results.append(business)
                
                next_page_token = places_result.get('next_page_token')
                if not next_page_token:
                    break
                
                logger.info(f"  Collected {len(results)} results so far...")
        
        except Exception as e:
            logger.error(f"Error collecting from Google Places: {e}")
        
        logger.info(f"✓ Collected {len(results)} from Google Places")
        self.stats['google'] = len(results)
        return results[:max_results]
    
    def collect_yelp(self, location: str, categories: str, max_results: int = 500) -> List[Dict]:
        """
        Collect business data from Yelp API
        
        Args:
            location: Location string (e.g., 'San Francisco, CA')
            categories: Business categories (e.g., 'plumbers')
            max_results: Maximum number of results to collect
        
        Returns:
            List of business dictionaries
        """
        logger.info(f"Collecting from Yelp: {categories} in {location}")
        
        headers = {'Authorization': f'Bearer {self.yelp_key}'}
        endpoint = 'https://api.yelp.com/v3/businesses/search'
        
        results = []
        offset = 0
        
        try:
            while len(results) < max_results:
                params = {
                    'location': location,
                    'categories': categories,
                    'limit': 50,
                    'offset': offset,
                    'sort_by': 'rating'
                }
                
                response = requests.get(endpoint, headers=headers, params=params)
                response.raise_for_status()
                
                businesses = response.json().get('businesses', [])
                
                if not businesses:
                    break
                
                for business in businesses:
                    location_data = business.get('location', {})
                    b = {
                        'source': 'yelp',
                        'name': business.get('name', ''),
                        'address': location_data.get('address1', ''),
                        'city': location_data.get('city', ''),
                        'state': location_data.get('state', ''),
                        'zip': location_data.get('zip_code', ''),
                        'phone': business.get('phone', ''),
                        'rating': business.get('rating', ''),
                        'review_count': business.get('review_count', ''),
                        'website': business.get('url', ''),
                        'categories': ','.join([cat['title'] for cat in business.get('categories', [])])
                    }
                    results.append(b)
                
                offset += 50
                logger.info(f"  Collected {len(results)} results so far...")
        
        except Exception as e:
            logger.error(f"Error collecting from Yelp: {e}")
        
        logger.info(f"✓ Collected {len(results)} from Yelp")
        self.stats['yelp'] = len(results)
        return results[:max_results]
    
    def enrich_with_hunter(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Enrich data with email addresses from Hunter.io
        
        Args:
            df: DataFrame with business data
        
        Returns:
            DataFrame with email addresses added
        """
        logger.info("Enriching with Hunter.io emails...")
        
        endpoint = 'https://api.hunter.io/v2/email-finder'
        enriched_count = 0
        
        for idx, row in df.iterrows():
            if pd.isna(row.get('website')) or row['website'] == '':
                continue
            
            try:
                # Extract domain from website
                domain = row['website'].replace('https://', '').replace('http://', '').split('/')[0]
                
                params = {
                    'domain': domain,
                    'api_key': self.hunter_key
                }
                
                response = requests.get(endpoint, params=params)
                response.raise_for_status()
                
                data = response.json()
                
                if data.get('data'):
                    df.at[idx, 'email'] = data['data'].get('email')
                    enriched_count += 1
            
            except Exception as e:
                logger.debug(f"Could not enrich {row.get('name')}: {e}")
            
            time.sleep(0.5)  # Rate limiting
        
        logger.info(f"✓ Enriched {enriched_count} records with emails")
        self.stats['hunter'] = enriched_count
        return df
    
    def deduplicate(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Remove duplicate records
        
        Args:
            df: DataFrame with business data
        
        Returns:
            Deduplicated DataFrame
        """
        logger.info("Deduplicating records...")
        
        initial_count = len(df)
        
        # Remove exact duplicates
        df = df.drop_duplicates(subset=['name', 'address'], keep='first')
        
        duplicates_removed = initial_count - len(df)
        self.stats['duplicates_removed'] = duplicates_removed
        
        logger.info(f"✓ Removed {duplicates_removed} duplicates")
        return df
    
    def validate_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Validate and clean data
        
        Args:
            df: DataFrame with business data
        
        Returns:
            Validated DataFrame
        """
        logger.info("Validating data...")
        
        # Remove rows with missing name or address
        df = df.dropna(subset=['name', 'address'])
        
        # Remove rows with empty name or address
        df = df[(df['name'].str.strip() != '') & (df['address'].str.strip() != '')]
        
        # Standardize phone numbers
        df['phone'] = df['phone'].apply(self._standardize_phone)
        
        logger.info(f"✓ Validated data, {len(df)} records remaining")
        return df
    
    @staticmethod
    def _standardize_phone(phone: str) -> str:
        """Standardize phone number format"""
        if pd.isna(phone):
            return ''
        
        # Remove common formatting
        phone = str(phone).replace('(', '').replace(')', '').replace('-', '').replace(' ', '')
        
        # Keep only digits
        phone = ''.join(c for c in phone if c.isdigit())
        
        # Format as (XXX) XXX-XXXX if 10 digits
        if len(phone) == 10:
            return f"({phone[:3]}) {phone[3:6]}-{phone[6:]}"
        
        return phone
    
    def run(self, location_name: str, location_coords: Tuple[float, float], 
            search_type: str, output_file: str = 'businesses.csv') -> pd.DataFrame:
        """
        Run complete data collection workflow
        
        Args:
            location_name: Name of location (for logging)
            location_coords: Tuple of (latitude, longitude)
            search_type: Type of business to search for
            output_file: Output CSV filename
        
        Returns:
            DataFrame with collected data
        """
        logger.info(f"\n{'='*60}")
        logger.info(f"Starting data collection for {search_type} in {location_name}")
        logger.info(f"{'='*60}\n")
        
        # Collect from Google Places
        google_data = self.collect_google_places(location_coords, search_type)
        
        # Collect from Yelp
        yelp_data = self.collect_yelp(location_name, search_type)
        
        # Combine data
        all_data = google_data + yelp_data
        df = pd.DataFrame(all_data)
        
        if len(df) == 0:
            logger.error("No data collected!")
            return df
        
        # Validate data
        df = self.validate_data(df)
        
        # Deduplicate
        df = self.deduplicate(df)
        
        # Enrich with Hunter
        if self.hunter_key:
            df = self.enrich_with_hunter(df)
        
        # Save to CSV
        df.to_csv(output_file, index=False)
        
        self.stats['final_count'] = len(df)
        
        logger.info(f"\n{'='*60}")
        logger.info(f"✓ Collection complete!")
        logger.info(f"{'='*60}")
        logger.info(f"Google Places: {self.stats['google']} records")
        logger.info(f"Yelp: {self.stats['yelp']} records")
        logger.info(f"Duplicates removed: {self.stats['duplicates_removed']}")
        logger.info(f"Hunter enrichments: {self.stats['hunter']}")
        logger.info(f"Final count: {self.stats['final_count']} records")
        logger.info(f"Saved to: {output_file}\n")
        
        return df


def main():
    """Main entry point"""
    
    # Example: Collect plumbers in San Francisco
    collector = DirectoryDataCollector()
    
    df = collector.run(
        location_name='San Francisco, CA',
        location_coords=(37.7749, -122.4194),
        search_type='plumber',
        output_file='plumbers_sf.csv'
    )
    
    # Display sample results
    logger.info("Sample results:")
    logger.info(df.head().to_string())
    
    # Display statistics
    logger.info(f"\nData quality:")
    logger.info(f"  Records with phone: {df['phone'].notna().sum()} ({df['phone'].notna().sum()/len(df)*100:.1f}%)")
    logger.info(f"  Records with website: {df['website'].notna().sum()} ({df['website'].notna().sum()/len(df)*100:.1f}%)")
    logger.info(f"  Records with email: {df['email'].notna().sum()} ({df['email'].notna().sum()/len(df)*100:.1f}%)")
    logger.info(f"  Average rating: {df['rating'].mean():.2f}")


if __name__ == '__main__':
    main()
