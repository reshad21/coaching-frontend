/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { 
  useGetSiteSettingQuery, 
  useCreateSiteSettingMutation, 
  useUpdateSiteSettingMutation 
} from "@/redux/api/siteSettingApi/siteSettingApi";
import { uploadImageToImgbb } from "@/utils/uploadImageToImgbb";
import { ChevronRight, Settings, Upload, Image, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

// Image Upload Component (reusable for logo and favicon)
const ImageUploadField = ({
  name,
  label,
  inputId,
  fileTypes = "image/jpeg,image/png,image/gif,image/jpg,image/webp,image/svg+xml,image/x-icon",
  defaultUrl,
  description,
  previewSize = "h-24 w-24",
  previewRounded = "rounded-lg",
}: {
  name: string;
  label: string;
  inputId: string;
  fileTypes?: string;
  defaultUrl?: string;
  description?: string;
  previewSize?: string;
  previewRounded?: string;
}) => {
  const { setValue } = useFormContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("No file chosen");

  const defaultImage = defaultUrl || logo;

  // Update preview when defaultUrl changes (for edit mode)
  useEffect(() => {
    if (defaultUrl) {
      setSelectedImage(defaultUrl);
      setFileName("Current image");
    }
  }, [defaultUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setValue(name, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className={`${previewSize} ${previewRounded} overflow-hidden border border-gray-300 shadow-sm bg-white flex items-center justify-center p-2`}>
          <img
            src={selectedImage || defaultImage}
            alt={`${label} Preview`}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition"
              onClick={() => document.getElementById(inputId)?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <span className="text-sm text-gray-600 truncate max-w-[200px]">{fileName}</span>
          </div>
          <input
            id={inputId}
            type="file"
            accept={fileTypes}
            className="hidden"
            onChange={handleImageChange}
          />
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      </div>
    </div>
  );
};

const SiteSettingPage = () => {
  const { data: siteSettingData, isLoading: isLoadingSettings } = useGetSiteSettingQuery(undefined);
  const [createSiteSetting, { isLoading: isCreating }] = useCreateSiteSettingMutation();
  const [updateSiteSetting, { isLoading: isUpdating }] = useUpdateSiteSettingMutation();

  // API returns an array, get the first item
  const existingSetting = siteSettingData?.data?.[0];
  const isEditMode = !!existingSetting?.id;

  const form = useForm({
    defaultValues: {
      brandName: "",
      logo: null,
      favicon: null,
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingSetting) {
      form.reset({
        brandName: existingSetting.brandName || "",
        logo: null,
        favicon: null,
      });
    }
  }, [existingSetting, form]);

  const onSubmit = async (data: any) => {
    let logoUrl = existingSetting?.logo || "";
    let faviconUrl = existingSetting?.favicon || "";
    
    // Only upload if new file is selected
    if (data.logo && data.logo instanceof File) {
      logoUrl = await uploadImageToImgbb(data.logo);
    }

    if (data.favicon && data.favicon instanceof File) {
      faviconUrl = await uploadImageToImgbb(data.favicon);
    }

    const siteSettingPayload = {
      brandName: data.brandName,
      logo: logoUrl,
      favicon: faviconUrl,
    };

    console.log("Submitting payload:", siteSettingPayload);

    let res;
    if (isEditMode) {
      // Update existing setting
      res = await updateSiteSetting({ 
        id: existingSetting.id, 
        data: siteSettingPayload 
      });
    } else {
      // Create new setting
      res = await createSiteSetting(siteSettingPayload);
    }

    console.log("API Response:", res);

    if ("data" in res && res.data?.success) {
      toast.success(res.data.message || `Site settings ${isEditMode ? 'updated' : 'created'} successfully!`);
    } else if ("error" in res) {
      const errorMessage = (res.error as any)?.data?.message || "An error occurred while saving site settings.";
      toast.error(errorMessage);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  if (isLoadingSettings) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading site settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors font-medium">
                Dashboard
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Site Settings</span>
            </nav>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Site Settings</h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? "Update your site's branding including logo, favicon and brand name." 
                : "Configure your site's branding including logo, favicon and brand name."}
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Brand Name Section */}
                <div className="border-b border-border pb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Brand Information</h2>
                  <div className="grid grid-cols-1 gap-6 max-w-md">
                    <FormFieldWrapper
                      name="brandName"
                      label="Brand Name"
                      placeholder="Enter your brand name"
                      control={form.control}
                      rules={{ required: "Brand name is required" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This name will appear in the header and throughout the application.
                  </p>
                </div>

                {/* Logo Section */}
                <div className="border-b border-border pb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Site Logo
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your organization's logo. This will be displayed in the header and other branded areas.
                  </p>
                  <ImageUploadField 
                    name="logo" 
                    label="Upload Logo"
                    inputId="logo-upload"
                    defaultUrl={existingSetting?.logo}
                    description="Supported formats: JPEG, PNG, GIF, SVG. Recommended size: 200x200px"
                    previewSize="h-24 w-24"
                    previewRounded="rounded-lg"
                  />
                </div>

                {/* Favicon Section */}
                <div className="border-b border-border pb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Favicon
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a favicon for your site. This small icon appears in browser tabs and bookmarks.
                  </p>
                  <ImageUploadField 
                    name="favicon" 
                    label="Upload Favicon"
                    inputId="favicon-upload"
                    defaultUrl={existingSetting?.favicon}
                    fileTypes="image/png,image/x-icon,image/ico,image/svg+xml"
                    description="Supported formats: PNG, ICO, SVG. Recommended size: 32x32px or 16x16px"
                    previewSize="h-16 w-16"
                    previewRounded="rounded-md"
                  />
                </div>

                {/* Preview Section */}
                <div className="border-b border-border pb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Header Preview</h2>
                  <div className="bg-primary rounded-lg p-4 flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1">
                      <img 
                        src={existingSetting?.logo || logo} 
                        alt="Logo" 
                        className="h-full w-auto object-contain" 
                      />
                    </div>
                    <span className="text-white text-xl font-bold tracking-wide">
                      {form.watch("brandName") || existingSetting?.brandName || "Brand Name"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This is how your branding will appear in the header.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isEditMode ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        {isEditMode ? 'Update Settings' : 'Save Settings'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingPage;
