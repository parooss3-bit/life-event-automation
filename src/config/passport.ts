import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { prisma, logger } from '../index';
import { generateTokens } from '../utils/auth';

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'name', 'emails', 'picture', 'birthday'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.info('Facebook OAuth callback', { facebookId: profile.id });

        // Check if user exists
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { facebookId: profile.id },
              { email: profile.emails?.[0]?.value },
            ],
          },
        });

        // Create user if doesn't exist
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
              firstName: profile.name?.givenName || profile.displayName || '',
              lastName: profile.name?.familyName || '',
              avatarUrl: profile.photos?.[0]?.value,
              facebookId: profile.id,
              subscriptions: {
                create: {
                  planId: 'free',
                  status: 'active',
                },
              },
            },
          });

          logger.info('New user created via Facebook', { userId: user.id });
        } else if (!user.facebookId) {
          // Link Facebook account to existing user
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              facebookId: profile.id,
              avatarUrl: profile.photos?.[0]?.value || user.avatarUrl,
            },
          });

          logger.info('Facebook account linked to existing user', { userId: user.id });
        }

        // Store access token for later use
        // In production, you should encrypt this
        const userData = {
          id: user.id,
          email: user.email,
          facebookId: profile.id,
          accessToken,
          refreshToken,
        };

        done(null, userData);
      } catch (error) {
        logger.error('Facebook OAuth error', error);
        done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
