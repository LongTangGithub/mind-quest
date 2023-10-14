import Image from 'next/image'

import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignInButton from '@/components/SignInButton';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getAuthSession()
  if(session?.user){                    // if user is logged in
    return redirect('/dashboard')       // redirect them back to the dashboard
  }
  return (
    // Centering the div in the middle
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"> 
      <Card className='w-[300px]'>
        <CardHeader>
          <CardTitle>Welcome to MindQuest</CardTitle>
          <CardDescription>
            Quizmify is a platform for creating quizzes using AI!. Get started
            by loggin in below!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignInButton text='Sign In with Google!'/>
        </CardContent>

      </Card>
    </div>
  )
}

