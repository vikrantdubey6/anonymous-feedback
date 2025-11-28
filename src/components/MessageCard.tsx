'use client'
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button";
import { Trash, trash } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";
import { Message } from "@/model/User";

type MessasgeCardProps = {
    message: Message;
    onMessageDelete:(messageId: string) => void
}
function MessageCard({message, onMessageDelete}: MessasgeCardProps) {
    const handleDeleteConfirm = async() => {
         try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success( response.data.message,
      )
      onMessageDelete(message._id as string);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
          axiosError.response?.data.message ?? 'Failed to delete message'
       );
    } 
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle> {message.content} </CardTitle>
        <CardDescription> Unknown user {String(message._id)}</CardDescription>
        <CardAction>{new Date(message.createdAt).toLocaleString()}</CardAction>
      </CardHeader>
      <CardContent>
      </CardContent>
      <CardFooter>
        {/* <p className="p-2 m-2 font-medium">Delete  </p> */}
        <AlertDialog>
      <AlertDialogTrigger asChild className="items-end">
        <Button variant="destructive"><Trash className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export default MessageCard;
