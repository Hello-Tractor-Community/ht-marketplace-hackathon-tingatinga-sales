"use client";
import { useCreateSellerProfileMutation } from "@/lib/swr/hooks";
import { URLS } from "@/lib/urls/urls";
import {
  Button,
  Container,
  Group,
  LoadingOverlay,
  MultiSelect,
  Select,
  Stack,
  Stepper,
  Switch,
  Text,
  TextInput,
  Textarea
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

const stepperConfig = [
  {
    step: 1,
    label: "Business Information",
    description: "Business details",
    fields: [
      {
        key: "businessName",
        label: "Business Name",
        type: "text",
        required: true,
      },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    step: 2,
    label: "Contact & Communication",
    description: "Contact info",
    fields: [
      { key: "email", label: "Email", type: "text", required: true },
      {
        key: "phoneNumber",
        label: "Phone Number",
        type: "text",
        required: true,
      },
      {
        key: "preferredContactMethod",
        label: "Preferred Contact Method",
        type: "select",
        options: ["Email", "Phone", "WhatsApp"],
      },
      { key: "website", label: "Website", type: "text" },
    ],
  },
  {
    step: 3,
    label: "Location Details",
    description: "Business location",
    fields: [
      { key: "country", label: "Country", type: "text" },
      { key: "region", label: "Region", type: "text" },
      { key: "city", label: "City", type: "text" },
      { key: "postalCode", label: "Postal Code", type: "text" },
    ],
  },
  {
    step: 4,
    label: "Review and Submit",
    description: "Review your information",
    fields: [],
  },
];

const SellerProfileStepper = () => {
  const { error, isMutating, trigger } = useCreateSellerProfileMutation();
  const [active, setActive] = useState(0); // Tracks the current step
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { data: session, status } = useSession();
  const router = useRouter();

  const nextStep = () => {
    const currentStep = stepperConfig[active];
    const newErrors: Record<string, string> = {};

    // Check required fields for current step and mark errors if any
    currentStep.fields.forEach((field) => {
      if (field.required && !formData[field.key]?.trim()) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    // If there are any errors, prevent proceeding
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});
    setActive((prev) => Math.min(prev + 1, stepperConfig.length - 1));
  };

  const prevStep = () => setActive((prev) => Math.max(prev - 1, 0));

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Remove field error on change
    setFormErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };

  const handleSubmit = () => {
    trigger(formData)
      .then(() => {
        if (!error) {
          toast.success("Profile created successfully.");
          router.push(URLS.PROFILE);
        }
      })
      .catch(() => {
        toast.error("Failed to create profile. Please try again.");
      });
  };

  const renderPreview = () => {
    const previewData = Object.entries(formData).map(([key, value]) => {
      const label = stepperConfig
        .flatMap((step) => step.fields)
        .find((field) => field.key === key)?.label;
      return { label: label || key, value };
    });

    return (
      <Stack gap="sm">
        {previewData.map(({ label, value }) => (
          <div key={label}>
            <Text fw={500}>{label}:</Text>
            <Text c="dimmed">
              {Array.isArray(value) ? value.join(", ") : value || "N/A"}
            </Text>
          </div>
        ))}
      </Stack>
    );
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(URLS.LOGIN);
    }
    if (session?.user.sellerId && session.user.businessName) {
      router.push(URLS.SELLERS_PROFILE(session.user.businessName));
    }
  }, [status, router]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingOverlay visible={status === "loading"} />
      <Container size={1400}>
        <Stepper active={active} onStepClick={setActive} size="sm">
          {stepperConfig.map((step, index) => (
            <Stepper.Step
              key={step.step}
              label={step.label}
              description={step.description}
            >
              {index === stepperConfig.length - 1
                ? renderPreview()
                : step.fields.map((field) => {
                    const errorMessage = formErrors[field.key];

                    switch (field.type) {
                      case "text":
                        return (
                          <TextInput
                            key={field.key}
                            label={field.label}
                            value={formData[field.key] || ""}
                            onChange={(e) =>
                              handleChange(field.key, e.target.value)
                            }
                            required={field.required}
                            error={errorMessage}
                          />
                        );
                      case "textarea":
                        return (
                          <Textarea
                            key={field.key}
                            label={field.label}
                            value={formData[field.key] || ""}
                            onChange={(e) =>
                              handleChange(field.key, e.target.value)
                            }
                            error={errorMessage}
                          />
                        );
                      case "select":
                        return (
                          <Select
                            key={field.key}
                            label={field.label}
                            value={formData[field.key] || ""}
                            onChange={(value) => handleChange(field.key, value)}
                            data={field.options || []}
                            error={errorMessage}
                          />
                        );
                      case "multi-select":
                        return (
                          <MultiSelect
                            key={field.key}
                            label={field.label}
                            value={formData[field.key] || []}
                            onChange={(value) => handleChange(field.key, value)}
                            data={field.options || []}
                            error={errorMessage}
                          />
                        );
                      case "switch":
                        return (
                          <Switch
                            key={field.key}
                            label={field.label}
                            checked={formData[field.key] || false}
                            onChange={(e) =>
                              handleChange(field.key, e.target.checked)
                            }
                          />
                        );
                      default:
                        return null;
                    }
                  })}
            </Stepper.Step>
          ))}
        </Stepper>

        <Group gap="right" mt="xl">
          <Button variant="outline" onClick={prevStep} disabled={active === 0}>
            Previous
          </Button>
          {active === stepperConfig.length - 1 ? (
            <Button
              onClick={handleSubmit}
              loading={isMutating}
              disabled={isMutating}
            >
              Submit
            </Button>
          ) : (
            <Button onClick={nextStep}>Next</Button>
          )}
        </Group>
      </Container>
    </Suspense>
  );
};

export default SellerProfileStepper;
