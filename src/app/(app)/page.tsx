'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay"
import { BackgroundBeams } from '@/components/ui/background-beams'
// import messages from '@/messages.json' // Removed this import as it was causing an error

// Using mock data here as the JSON file path could not be resolved
const messages = [
  {
    "title": "Great Platform!",
    "content": "Really appreciate this anonymous space. It's much needed.",
    "recieved": "2 days ago"
  },
  {
    "title": "A Suggestion",
    "content": "Could we have a way to categorize the feedback?",
    "recieved": "1 day ago"
  },
  {
    "title": "Thank You",
    "content": "Felt good to get this off my chest. Thank you for the privacy.",
    "recieved": "4 hours ago"
  },
  {
    "title": "Mobile Experience",
    "content": "The mobile site works surprisingly well. Good job!",
    "recieved": "30 minutes ago"
  }
]


function Home() {
  return (
    
    // Main container: Added padding `p-4` for small screens
    <div className="max-w-screen min-h-screen flex items-center flex-col justify-center bg-gradient-to-br from-black via-gray-800 to-black p-4">
      <BackgroundBeams />
      
      {/* Title: Adjusted text sizes and margins for responsiveness */}
      <h1 className='font-bold text-3xl sm:text-4xl md:text-5xl mt-12 sm:mt-20 md:mt-24 text-center px-4 font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100' >
        Share Your Thoughts Anonymously
      </h1>
      
      {/* Description: Removed restrictive horizontal margins, added max-width and text-center */}
      <p className='text-sm sm:text-base lg:text-lg max-w-md sm:max-w-lg md:max-w-3xl text-center px-6 sm:px-8 my-4 md:my-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 '>
        Welcome to our anonymous feedback platform where you can express your opinions freely and safely.<br /> Your voice matters, and we ensure your privacy while sharing feedback.
      </p>
      
       {/* Carousel Container: Adjusted width to be responsive */}
      <div className='w-full h-[calc(100%-2rem)] max-w-sm sm:max-w-md md:max-w-lg mt-5 sm:mt-10 md:mt-12 flex justify-center'>
        <Carousel 
          className="w-full" // Removed max-w-xs, letting parent control width
          plugins={[AutoPlay({ delay: 4000 })]}
        >
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="w-full p-1"> {/* Added p-1 for spacing */}
                    {/* Card: Set a responsive height and flex-col layout */}
                    <Card className='bg-gray-800 h-80 sm:h-[22rem] md:h-96 dark:bg-gray-900 flex flex-col justify-between rounded-lg'>
                      <CardHeader
                        className="text-lg sm:text-lg md:text-xl font-semibold text-white/90 dark:text-gray-200 p-6" // Added consistent padding
                      >
                        {message.title}
                      </CardHeader>
                      
                      {/* Card Content: Removed aspect-square, added flex-1 to fill space */}
                      <CardContent className="flex flex-1 items-center justify-center p-6 text-center">
                        <span className="text-xl sm:text-xl md:text-2xl font-semibold  text-white/90 dark:text-gray-200">{message.content}</span>
                      </CardContent>
                      
                      <CardFooter
                        className="text-base sm:text-base md:text-lg font-semibold text-white/90 dark:text-gray-200 p-6 pt-0" // Adjusted padding
                      >
                        {message.recieved}
                      </CardFooter>
                    </Card> 
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

       </div>
       
       {/* Footer: Added responsive top margin */}
       <footer className='mt-10 sm:mt-14 md:mt-16'>
          <p className="text-center text-sm leading-loose text-muted-foreground
          dark:text-muted-foreground">
            copyright &copy; 2023
          </p>
       </footer>
    </div>
    
 
  )
}

export default Home