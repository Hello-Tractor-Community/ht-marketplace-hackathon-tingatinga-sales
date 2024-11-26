"use client";
import {
  conditionOptions,
  productTypes,
  transmissionTypesOptions,
  wheelTypesOptions,
} from "@/lib/constants";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetEngineTypesQuery,
} from "@/lib/swr/hooks";
import {
  Button,
  Container,
  Group,
  LoadingOverlay,
  MultiSelect,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { UploadImages } from "../upload-images";
import { URLS } from "@/lib/urls/urls";

// Define flexible field configuration type
type FieldConfig =
  | {
      key: string;
      label: string;
      type: string;
      required: boolean;
      format?: string;
      options?: { label: string; value: string }[];
    }
  | {
      key: string;
      label: string;
      type: string;
      required?: boolean;
      options?: { label: string; value: string }[];
      format?: string;
    };

// Define type for step configuration
type StepConfig = {
  step: number;
  label: string;
  description: string;
  fields: FieldConfig[];
};

const ProductCreateForm = () => {
  const content =
    '<h2 style="text-align: center;">Welcome to Tractor Specifications Editor</h2><p style="text-align: center;">Enter detailed product specifications for your tractor model here</p>';

  const [active, setActive] = useState(0);
  const [productType, setProductType] = useState<"product" | "tractor">(
    "product"
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [images, setImages] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { error, isMutating, trigger } = useCreateProductMutation(productType);

  const router = useRouter();

  const { categories } = useGetCategoriesQuery();
  const { engineTypes } = useGetEngineTypesQuery();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
  });

  // Transform categories into select options
  const categoryOptions =
    categories?.map((category) => ({
      label: category.name,
      value: category.id,
    })) || [];

  // Transform engine types into select options
  const engineTypeOptions =
    engineTypes?.map((engineType) => ({
      label: engineType.name,
      value: engineType.id,
    })) || [];

  // Get current stepper configuration based on product type
  const getStepperConfig = () => {
    const baseConfig: Record<string, StepConfig[]> = {
      product: [
        {
          step: 1,
          label: "Basic Details",
          description: "Product information",
          fields: [
            {
              key: "categoryId",
              label: "Category",
              type: "select",
              required: true,
              options: categoryOptions,
            },
            {
              key: "name",
              label: "Product Name",
              type: "text",
              required: true,
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
            },
            { key: "content", label: "Detailed Description", type: "richtext" },
          ],
        },
        {
          step: 2,
          label: "Images",
          description: "Upload product images",
          fields: [{ key: "images", label: "Images", type: "images" }],
        },
        {
          step: 3,
          label: "Pricing and Stock",
          description: "Product price and stock details",
          fields: [
            {
              key: "currency",
              label: "Currency",
              type: "select",
              required: true,
              options: [
                { label: "KSH", value: "ksh" },
                { label: "USD", value: "usd" },
                { label: "EUR", value: "eur" },
              ],
            },
            {
              key: "price",
              label: "Price",
              type: "text",
              required: true,
              format: "number",
            },
            {
              key: "stockQuantity",
              label: "Stock Quantity",
              type: "text",
              format: "number",
              required: true,
            },
            {
              key: "availabilityStatus",
              label: "Availability",
              type: "select",
              required: true,
              options: [
                { label: "In Stock", value: "in_stock" },
                { label: "Pre-order", value: "pre_order" },
              ],
            },
          ],
        },
        {
          step: 4,
          label: "Review and Submit",
          description: "Review and submit product",
          fields: [],
        },
      ],
      tractor: [
        {
          step: 1,
          label: "Tractor Basic Details",
          description: "Tractor product information",
          fields: [
            {
              key: "categoryId",
              label: "Category",
              type: "select",
              required: true,
              options: categoryOptions,
            },
            {
              key: "name",
              label: "Tractor Name",
              type: "text",
              required: true,
            },
            { key: "description", label: "Description", type: "textarea" },
            { key: "content", label: "Detailed Description", type: "richtext" },
          ],
        },
        {
          step: 2,
          label: "Tractor Images",
          description: "Tractor technical details",
          fields: [{ key: "images", label: "Images", type: "images" }],
        },
        {
          step: 3,
          label: "Pricing and Availability",
          description: "Tractor pricing and stock",
          fields: [
            {
              key: "currency",
              label: "Currency",
              type: "select",
              required: true,
              options: [
                { label: "USD", value: "usd" },
                { label: "EUR", value: "eur" },
              ],
            },
            {
              key: "price",
              label: "Price",
              type: "text",
              format: "number",
              required: true,
            },
            {
              key: "stockQuantity",
              label: "Available Units",
              type: "text",
              format: "number",
              required: true,
            },
            {
              key: "availabilityStatus",
              label: "Availability",
              type: "select",
              required: true,
              options: [
                { label: "In Stock", value: "in_stock" },
                { label: "Pre-order", value: "pre_order" },
              ],
            },
          ],
        },
        {
          step: 4,
          label: "Technical Specifications",
          description: "Tractor technical details",
          fields: [
            {
              key: "engineTypeId",
              label: "Engine Type",
              type: "select",
              required: true,
              options: engineTypeOptions,
            },
            {
              key: "horsePower",
              label: "Horsepower (HP)",
              type: "text",
              format: "number",
              required: true,
            },
            {
              key: "fuelCapacity",
              label: "Fuel Capacity (Liters)",
              type: "text",
              format: "number",
              required: true,
            },
            {
              key: "maxSpeed",
              label: "Max Speed (km/h)",
              type: "text",
              format: "number",
              required: true,
            },
            {
              key: "transmissionType",
              label: "Transmission Type",
              type: "select",
              required: true,
              options: transmissionTypesOptions,
            },
            {
              key: "wheelType",
              label: "Wheel Type",
              type: "select",
              required: true,
              options: wheelTypesOptions,
            },

            {
              key: "operatingWeight",
              label: "Operating Weight (kg)",
              type: "text",
              format: "number",
            },
            {
              key: "serialNumber",
              label: "Serial Number",
              type: "text",
              required: true,
            },
            {
              key: "make",
              label: "Make",
              type: "text",
              required: true,
            },
            {
              key: "model",
              label: "Model",
              type: "text",
              required: true,
            },
            {
              key: "year",
              label: "Year",
              type: "text",
              format: "number",
              required: true,
            },
            {
              key: "hoursUsed",
              label: "Hours Used",
              type: "text",
              format: "number",
              required: true,
            },
            {
              key: "condition",
              label: "Condition",
              type: "select",
              required: true,
              options: conditionOptions,
            },
          ],
        },
        {
          step: 5,
          label: "Additional Details",
          description: "Warranty and other information",
          fields: [
            { key: "warranty", label: "Warranty Details", type: "textarea" },
            {
              key: "attachmentsCompatible",
              label: "Compatible Attachments",
              type: "multi-select",
              options: [
                { label: "Plow", value: "plow" },
                { label: "Seeder", value: "seeder" },
                { label: "Harvester", value: "harvester" },
              ],
            },
          ],
        },
        {
          step: 6,
          label: "Review and Submit",
          description: "Review and submit product",
          fields: [],
        },
      ],
    };

    return [
      {
        step: 0,
        label: "Product Type",
        description: "Select product type",
        fields: [
          {
            key: "productType",
            label: "Product Type",
            type: "select",
            required: true,
            options: Object.entries(productTypes).map(([label, value]) => ({
              label: value,
              value,
            })),
          },
        ],
      },
      ...baseConfig[productType],
    ];
  };

  const stepperConfig = getStepperConfig();

  const nextStep = () => {
    const currentStep = stepperConfig[active];
    const newErrors: Record<string, string> = {};

    // Special handling for product type selection
    if (active === 0) {
      const selectedType = formData.productType;
      if (selectedType) {
        setProductType(selectedType as "product" | "tractor");
        setActive(1);
        return;
      }
    }

    // Validate current step fields
    currentStep.fields.forEach((field) => {
      if (
        "required" in field &&
        field.required &&
        !formData[field.key]?.trim()
      ) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});
    setActive((prev) => Math.min(prev + 1, stepperConfig.length - 1));
  };

  const prevStep = () => {
    // Special handling to reset product type when going back from first step
    if (active === 1) {
      setProductType("product");
    }
    setActive((prev) => Math.max(prev - 1, 0));
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };

  const handleSubmit = () => {
    // Remove product type from final submission
    const submissionData = {
      ...formData,
      images,
      content,
      productType: formData.productType,
    };
    delete submissionData.productType;

    trigger(submissionData)
      .then(() => {
        if (!error) {
          toast.success("Product created successfully.");
          router.push(URLS.SELLER_DASHBOARD);
        }
      })
      .catch(() => {
        toast.error("Failed to create product. Please try again.");
      });
  };

  const renderPreview = () => {
    const filteredData = Object.entries(formData)
      .filter(([key]) => key !== "productType")
      .map(([key, value]) => {
        const label = stepperConfig
          .flatMap((step) => step.fields)
          .find((field) => field.key === key)?.label;
        return { label: label || key, value };
      });

    return (
      <Stack gap="sm">
        {filteredData.map(({ label, value }) => (
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingOverlay visible={isMutating} />
      <Container size={1400}>
        <Stepper
          active={active}
          onStepClick={setActive}
          size="sm"
          allowNextStepsSelect={false}
        >
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
                            type={field.format === "number" ? "number" : "text"}
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
                            required={field.required}
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
                            required={field.required}
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
                            required={field.required}
                            error={errorMessage}
                          />
                        );
                      case "richtext":
                        return (
                          <>
                            <Text size="sm" mt="md" fw={500}>
                              {field.label}
                            </Text>
                            <RichTextEditor editor={editor}>
                              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                <RichTextEditor.ControlsGroup>
                                  <RichTextEditor.Bold />
                                  <RichTextEditor.Italic />
                                  <RichTextEditor.Underline />
                                  <RichTextEditor.Strikethrough />
                                  <RichTextEditor.ClearFormatting />
                                  <RichTextEditor.Highlight />
                                  <RichTextEditor.Code />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                  <RichTextEditor.H1 />
                                  <RichTextEditor.H2 />
                                  <RichTextEditor.H3 />
                                  <RichTextEditor.H4 />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                  <RichTextEditor.Blockquote />
                                  <RichTextEditor.Hr />
                                  <RichTextEditor.BulletList />
                                  <RichTextEditor.OrderedList />
                                  <RichTextEditor.Subscript />
                                  <RichTextEditor.Superscript />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                  <RichTextEditor.Link />
                                  <RichTextEditor.Unlink />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                  <RichTextEditor.AlignLeft />
                                  <RichTextEditor.AlignCenter />
                                  <RichTextEditor.AlignJustify />
                                  <RichTextEditor.AlignRight />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                  <RichTextEditor.Undo />
                                  <RichTextEditor.Redo />
                                </RichTextEditor.ControlsGroup>
                              </RichTextEditor.Toolbar>

                              <RichTextEditor.Content />
                            </RichTextEditor>
                          </>
                        );
                      case "images":
                        return (
                          <div>
                            <Text size="sm" mt="md" fw={500}>
                              {field.label}
                            </Text>
                            <UploadImages files={images} setFiles={setImages} />
                          </div>
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
            <Button onClick={handleSubmit} loading={isMutating}>
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

export default ProductCreateForm;
