import React from 'react'
import toast from "react-hot-toast";
import { useState, DragEvent, useEffect } from "react";

const Test = () => {
  useEffect(() => {
    toast.success("dfssa");
    // if (submissionData) {
    //   toast.success(`Submission Status: ${submissionData.status}`, {
    //     duration: 4000,
    //   });
    // }
  }, []);
  return (
    <div className='bg-red-500 h-[500px]'>Test</div>
  )
}

export default Test