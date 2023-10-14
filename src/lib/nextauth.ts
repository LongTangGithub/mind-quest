
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {prisma} from "./db";
import GoogleProvider from 'next-auth/providers/google'
import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
  } from "next-auth";


declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        id: string;
    }
}

/**
 * Inside the callback function, it receives a token property as its parameter. 
 * It uses the prisma database client to perform a db query to find a user with the email that matches token property
 * It does this by calling prisma.user.findFirst() with a query condition that looks for a user with the specified email.
 * If a user with the matching email is found in the database (db_user is not null or undefined):
 * It updates the token by setting its id property to be the id of the user found in the database. 
 * This is typically done to associate the user's ID with the JWT for later reference.
 * Finally, it returns the token with or without modifications, depending on whether a user with the matching email was found in the database.
 */
export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        jwt: async ({token}) => {
            const db_user = await prisma.user.findFirst({
                where:{
                    email: token?.email
                }
            })
            if(db_user){
                token.id = db_user.id
            }
            return token
        },
    /**
     * When a user session is being created or updated, the function is called. It checks if the token object exists, if so
     * it populates the session object with user-related information from the token. 
     * Finally, it returns the session object, which may or may not have been modified based on the presence of a valid token.
     * 
     */
        session: ({session, token}) => {
            if(token){
                session.user.id = token.id 
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET, 
    adapter: PrismaAdapter(prisma),
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
};

export const getAuthSession = () => {
    return getServerSession(authOptions);
  };