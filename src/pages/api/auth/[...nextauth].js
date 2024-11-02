import NextAuth from "next-auth/next";
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from "next-auth/providers/email";

export const authOptions={
    providers:[
        GithubProvider({
            clientId:'7a678bf195f70d0dcddc',
            clientSecret:'8a1d1f8090ada55028f0fcc313dab1918df68d64'
        }),
        GoogleProvider({
            clientId:'706224846924-6ni3uchf354vsldjrum4idt8bnf7uare.apps.googleusercontent.com',
            clientSecret:'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'
        })

    ],

    secret:process.env.SECRET
}

export default NextAuth(authOptions)