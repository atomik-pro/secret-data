import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: 'select_account',
                    access_type: 'offline',
                    response_type: 'code',
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ account, profile}) {
            if (account?.provider === 'google') {
                return profile?.email?.endsWith("@atomik.pro") ?? false;
            }
            return false;
        },
        async session({ session, token}) {
            if (session.user) {
                session.user.email = token.email;
            }
            return session;
        },
        async jwt({ token, account}) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        }
    },
    debug: process.env.NODE_ENV === 'development'
};