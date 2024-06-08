import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import { dbConnection } from "@/lib/database/connection"
import { UserModel } from "@/models/userModel"
import bcrypt from "bcryptjs"

export const AuthOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
     if(user){
      token._id = user?._id?.toString()
      token.isVerified = user?.isVerified
      token.email = user?.email
      token.name = user?.name
     }

      return token
    },
    async session({ session, token }) {
      if(token){
        session.user._id = token?._id
        session.user.isVerified = token?.isVerified
        session.user.email = token?.email
        session.user.name = token?.name
        
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        await dbConnection()
        try {
          const userExistance = await UserModel.findOne({
            $or: [{ email: credentials?.email }, { name: credentials?.name }],
          })

          if(!userExistance) {
            throw new Error("User not found")
          }

          if(!userExistance?.isVerified) {
            throw new Error("User not verified")
          }

          const validPass = await bcrypt.compare(credentials?.password as string, userExistance.password)
          if(!validPass) {
            throw new Error("Invalid password")
          }

          return userExistance
        } catch (error: any) {
          throw new Error(error.message)
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET_KEY,
}
