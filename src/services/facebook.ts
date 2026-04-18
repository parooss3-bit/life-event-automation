import axios from 'axios';
import { logger } from '../index';

interface FacebookUser {
  id: string;
  name: string;
  email: string;
  picture?: {
    data: {
      url: string;
    };
  };
  birthday?: string;
}

interface FacebookFriend {
  id: string;
  name: string;
  picture?: {
    data: {
      url: string;
    };
  };
  birthday?: string;
  email?: string;
}

interface ExtractedContact {
  facebookId: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
  birthday?: Date;
  relationship: string;
}

export class FacebookService {
  private apiVersion = 'v18.0';
  private baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

  /**
   * Get user's Facebook profile information
   */
  async getUserProfile(accessToken: string): Promise<FacebookUser> {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          fields: 'id,name,email,picture,birthday',
          access_token: accessToken,
        },
      });

      logger.info('Facebook user profile retrieved', { userId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to get Facebook user profile', error);
      throw new Error('Failed to retrieve Facebook profile');
    }
  }

  /**
   * Get user's Facebook friends with birthday information
   */
  async getFriendsWithBirthdays(accessToken: string): Promise<FacebookFriend[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/friends`, {
        params: {
          fields: 'id,name,picture,birthday,email',
          limit: 5000, // Maximum allowed by Facebook
          access_token: accessToken,
        },
      });

      logger.info('Facebook friends retrieved', {
        count: response.data.data.length,
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to get Facebook friends', error);
      throw new Error('Failed to retrieve Facebook friends');
    }
  }

  /**
   * Extract contacts from Facebook friends
   * Filters for friends with birthday information
   */
  async extractContacts(accessToken: string): Promise<ExtractedContact[]> {
    try {
      const friends = await this.getFriendsWithBirthdays(accessToken);

      const contacts: ExtractedContact[] = friends
        .filter((friend) => friend.birthday) // Only include friends with birthdays
        .map((friend) => {
          const nameParts = friend.name.split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');

          // Parse birthday from Facebook format (MM/DD or MM/DD/YYYY)
          let birthday: Date | undefined;
          if (friend.birthday) {
            const parts = friend.birthday.split('/');
            if (parts.length === 2) {
              // MM/DD format (no year)
              const month = parseInt(parts[0], 10) - 1;
              const day = parseInt(parts[1], 10);
              birthday = new Date(new Date().getFullYear(), month, day);
            } else if (parts.length === 3) {
              // MM/DD/YYYY format
              const month = parseInt(parts[0], 10) - 1;
              const day = parseInt(parts[1], 10);
              const year = parseInt(parts[2], 10);
              birthday = new Date(year, month, day);
            }
          }

          return {
            facebookId: friend.id,
            firstName,
            lastName,
            email: friend.email,
            avatarUrl: friend.picture?.data?.url,
            birthday,
            relationship: 'friend', // Default relationship
          };
        });

      logger.info('Contacts extracted from Facebook', { count: contacts.length });
      return contacts;
    } catch (error) {
      logger.error('Failed to extract contacts from Facebook', error);
      throw new Error('Failed to extract contacts');
    }
  }

  /**
   * Verify Facebook access token is valid
   */
  async verifyAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/debug_token`, {
        params: {
          input_token: accessToken,
          access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
        },
      });

      const isValid = response.data.data.is_valid;
      logger.info('Facebook token verified', { isValid });
      return isValid;
    } catch (error) {
      logger.error('Failed to verify Facebook token', error);
      return false;
    }
  }

  /**
   * Get user's Facebook profile picture
   */
  async getProfilePicture(facebookId: string, accessToken: string): Promise<string | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/${facebookId}/picture`, {
        params: {
          type: 'large',
          redirect: false,
          access_token: accessToken,
        },
      });

      return response.data.data.url;
    } catch (error) {
      logger.error('Failed to get Facebook profile picture', error);
      return null;
    }
  }

  /**
   * Get user's Facebook events (if permissions granted)
   */
  async getUserEvents(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/events`, {
        params: {
          fields: 'id,name,start_time,end_time,description',
          limit: 100,
          access_token: accessToken,
        },
      });

      logger.info('Facebook events retrieved', {
        count: response.data.data.length,
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to get Facebook events', error);
      return [];
    }
  }

  /**
   * Get user's Facebook groups (if permissions granted)
   */
  async getUserGroups(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/groups`, {
        params: {
          fields: 'id,name,icon,member_count',
          limit: 100,
          access_token: accessToken,
        },
      });

      logger.info('Facebook groups retrieved', {
        count: response.data.data.length,
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to get Facebook groups', error);
      return [];
    }
  }

  /**
   * Refresh Facebook access token
   */
  async refreshAccessToken(accessToken: string): Promise<string | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          fb_exchange_token: accessToken,
        },
      });

      logger.info('Facebook access token refreshed');
      return response.data.access_token;
    } catch (error) {
      logger.error('Failed to refresh Facebook access token', error);
      return null;
    }
  }
}

export default new FacebookService();
