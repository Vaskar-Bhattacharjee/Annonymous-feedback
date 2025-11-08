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
import messages from '@/messages.json'

//import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

function Home() {
  return (
    

    <div className="max-w-screen min-h-screen flex items-center flex-col justify-center bg-gradient-to-br from-black via-gray-800 to-gray-800">
          {/* <div className="absolute inset-0 -z-0">
              <BackgroundRippleEffect />
          </div> */}
      
      <h1 className='font-bold text-5xl mt-8 font-mono tracking-tighter word-spacing-1 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100' >Share Your Thoughts Anonymously</h1>
      <p className='text-[18px] mx-40 my-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 '>Welcome to our anonymous feedback platform where you can express your opinions freely and safely.<br /> Your voice matters, and we ensure your privacy while sharing feedback.</p>
       {/* Carousel */}
      <div className='w-1/2 h-1/2 mt-8 flex justify-center'>
        <Carousel className="w-full max-w-xs"
        plugins={[AutoPlay({ delay: 4000 })]}
        
        >
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="w-full">
                    <Card className='bg-gray-800 h-110 px-8 dark:bg-gray-900'>
                      <CardHeader
                      className="text-lg font-semibold text-white/90 dark:text-gray-200"
                      >{message.title}</CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold  text-white/90 dark:text-gray-200">{message.content}</span>
                      </CardContent>
                      <CardFooter
                      className="text-lg font-semibold text-white/90 dark:text-gray-200 mb-8">{message.recieved}</CardFooter>
                    </Card> 
                  </div>
                </CarouselItem>
              ))
            }
            {/* {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card> 
                </div>
              </CarouselItem>
            ))} */}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

       </div>
              <footer className='mt-10'>
                <p className="text-center text-sm leading-loose text-muted-foreground
                dark:text-muted-foreground">
                  copyright &copy; 2023
                </p>
              </footer>
    </div>
    
 
  )
}

export default Home