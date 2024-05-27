import React, { useState } from "react";
import { uploadFile } from "../services/services";

interface OptionType {
  label: string;
  value: string;
}


/**
 * Props for the FileUpload component
 *
 * @property onCancel a function that will be called when the user clicks the cancel button
 */
type FileUplaodProps = {
  onCancel: () => void;
};

const FileUpload: React.FC<FileUplaodProps> = ({ onCancel }) => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [options, setOptions] = useState<OptionType[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [remarks, setRemarks] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [newTag, setNewTag] = useState<string>("");

  const handleCancel = () => {
    onCancel();
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setCategory(selectedOption);
    if (selectedOption === "Personal") {
      setOptions([
        { label: "John", value: "John" },
        { label: "Tom", value: "Tom" },
      ]);
    } else if (selectedOption === "Professional") {
      setOptions([
        { label: "Accounts", value: "Accounts" },
        { label: "HR", value: "HR" },
      ]);
    }
    setSubCategory(""); // Reset sub-category when main category changes
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubCategory(e.target.value);
  };

  const handleTagAddition = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleTagDeletion = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userdata = JSON.parse(localStorage.getItem("data") as string);
    if (userdata.token && file) {
      const data = {
        file,
        major_head: category,
        minor_head: subCategory,
        document_date: date,
        document_remarks: remarks,
        tags: tags.map((tag) => ({ tag_name: tag })),
        user_id: userdata.user_id, // Replace with actual user ID
      };

      try {
        await uploadFile(data, userdata.token);
        handleCancel();
        // Handle successful upload
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <h2 className="text-2xl font-semibold mb-6">Upload File</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded-lg shadow-md w-full max-w-lg  flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1">
          <p className="self-start"> Document Date:</p>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-2"
          />
        </label>
        <div className="flex flex-col gap-1">
          <label className="flex flex-col gap-1">
            <p className="self-start"> Category: </p>

            <select
              value={category}
              onChange={handleCategoryChange}
              className="border rounded p-2"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
            </select>
          </label>
          {category && (
            <label className="flex flex-col gap-1">
              <p className="self-start"> Sub Category: </p>

              <select
                value={subCategory}
                onChange={handleSubCategoryChange}
                className="border rounded p-2"
              >
                <option value="" disabled>
                  Select Sub Category
                </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="flex flex-col gap-1">
            <p className="self-start"> Tags:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="border rounded p-2 flex-grow"
              />
              <button
                type="button"
                onClick={handleTagAddition}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                Add Tag
              </button>
            </div>
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-gray-600 rounded-full px-4 py-1 flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagDeletion(tag)}
                  className="text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1">
          <p className="self-start"> Remarks:</p>

          <input
            required
            type="text"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <p className="self-start"> File:</p>
          <input
            required
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="border rounded p-2"
          />
        </label>
        <div className="flex gap-2 w-full">
          <button
            type="submit"
            className="bg-green-500 w-full text-white rounded px-4 py-2 mt-4"
          >
            Upload
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 w-full text-white rounded px-4 py-2 mt-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
