"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest } from "@/lib/api-service";

const carSchema = z.object({
  carModel: z.string().min(3, "Car model must be at least 3 characters"),
  price: z.number().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid price",
  }),
  phone: z.string().length(11, "Phone number must be exactly 11 digits"),
  city: z.enum(["Lahore", "Karachi"]),
  maxPictures: z
    .string()
    .transform(Number)
    .refine((n) => n >= 1 && n <= 10, {
      message: "Please select between 1 and 10 pictures",
    }),
});

const FormContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: yupResolver(
      yup.object().shape({
        carModel: yup
          .string()
          .min(3, "Car model must be at least 3 characters")
          .required(),
        price: yup.number().positive("Please enter a valid price").required(),
        phone: yup
          .string()
          .length(11, "Phone number must be exactly 11 digits")
          .required(),
        city: yup.mixed().oneOf(["Lahore", "Karachi"]).required(),
        maxPictures: yup
          .number()
          .min(1, "Please select between 1 and 10 pictures")
          .max(10, "Please select between 1 and 10 pictures")
          .required(),
      })
    ),
    defaultValues: {
      carModel: "",
      price: 0,
      phone: "",
      city: "Lahore",
      maxPictures: 4,
    },
  });

  async function onSubmit(values: any) {
    if (images.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload at least one image",
      });
      return;
    }

    if (images.length > Number(values.maxPictures)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `You can only upload up to ${values.maxPictures} images`,
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("carModel", values.carModel);
      formData.append("price", values.price.toString());
      formData.append("phone", values.phone);
      formData.append("city", values.city);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await apiRequest({
        endpoint: "/cars",
        requiresToken: true,
        method: "post",
        data: formData,
        contentType: "multipart/form-data",
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.error) {
        throw new Error("Failed to submit car listing");
      }

      toast({
        title: "Success",
        description: "Car listing submitted successfully",
      });

      form.reset();
      setImages([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxPictures = Number(form.getValues("maxPictures"));
    const newImages = Array.from(files);

    if (images.length + newImages.length > maxPictures) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `You can only upload up to ${maxPictures} images`,
      });
      return;
    }

    setImages((prev) => [...prev, ...newImages]);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="carModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter car model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      maxLength={11}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Lahore" />
                        </FormControl>
                        <FormLabel className="font-normal">Lahore</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Karachi" />
                        </FormControl>
                        <FormLabel className="font-normal">Karachi</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxPictures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Pictures</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select max number of pictures" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Upload Images</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Car image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {images.length < Number(form.getValues("maxPictures")) && (
                  <label className="border-2 border-dashed rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:border-primary">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <span className="text-sm text-muted-foreground">
                      + Add Pictures
                    </span>
                  </label>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Add Car"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormContent;
