import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { updateBanner, type BannerPayload } from "@/lib/api/banner";
import { Banner } from "@/types/Banner";
import { toast } from "sonner";
import { ImageUploader } from "@/app/dashboard/_components/image-upload";


type UpdateBannerDialogProps = {
  banner: Banner;
  onChange: () => Promise<void>;
};

export default function UpdateBannerDialog({
    banner,
    onChange,
}: UpdateBannerDialogProps) {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            title: banner.title || "",
            description: banner.description || "",
            buttonText: banner.buttonText || "",
            status: banner.status || "active",
            image: banner.image || "",
        },
    });

    const methods = useForm({
        defaultValues: {
            title: banner.title || "",
            description: banner.description || "",
            buttonText: banner.buttonText || "",
            status: banner.status || "active",
            image: banner.image || "",
        },
    });

    const onSubmit = async (data: BannerPayload) => {
        try {
            await updateBanner(banner._id, data);
            toast.success("Banner updated successfully!");
            onChange();
            setOpen(false);
        } catch (error) {
            toast.error("Update failed");
            console.error(error);
        }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit Banner</DialogTitle>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Input {...methods.register("title")} placeholder="Title" />
              <Textarea
                {...methods.register("description")}
                placeholder="Description"
              />
              <Input
                {...methods.register("buttonText")}
                placeholder="Button Text"
              />
              <Input {...methods.register("status")} placeholder="Status" />

              {/* ImageUploader now can use useFormContext() */}
              <ImageUploader name="image" />

              <div className="flex justify-end">
                <Button type="submit">Update</Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    );
}