import React, { useState } from "react";
import { searchDocuments } from "../services/services";
import { useUser } from "../context/UserContext";

/**
 * FileSearch component
 * @param onCancel - Function to be called when the cancel button is clicked
 * @returns JSX.Element
 */


//Interface to represent a select option

interface OptionType {
  /**
   * The label to display for the option
   */
  label: string;
  /**
   * The value to submit when the option is selected
   */
  value: string;
}
type FileSearchProps = {
  onCancel: () => void;
};

const FileSearch: React.FC<FileSearchProps> = ({ onCancel }) => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [options, setOptions] = useState<OptionType[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [documents, setDocuments] = useState<any[]>([]);
  const { userdata } = useUser();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Search submitted!");
    const token = userdata?.token;
    console.log(token);

    if (token) {
      const searchParams = {
        major_head: category,
        minor_head: subCategory,
        from_date: fromDate,
        to_date: toDate,
        tags: tags.map((tag) => ({ tag_name: tag })),
        uploaded_by: userdata.user_id,
        start: 0,
        length: 10,
        filterId: "",
        search: { value: "" },
      };

      try {
        const response = await searchDocuments(searchParams, token);
        console.log(response);

        setDocuments(response.data.data);
        handleCancel();
        // Handle search results
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Search Files</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-200 text-left">
            From Date:
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-200 text-left">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-200 text-left">
            Category:
          </label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Personal">Personal</option>
            <option value="Professional">Professional</option>
          </select>
        </div>
        {category && (
          <div>
            <label className="block mb-1 text-gray-200 text-left">
              Sub Category:
            </label>
            <select
              value={subCategory}
              onChange={handleSubCategoryChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
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
          </div>
        )}
        <div>
          <label className="block mb-1 text-gray-200 text-left">Tags:</label>
          <div className="flex items-center">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-grow px-3 py-2 border rounded-l-md shadow-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleTagAddition}
              className="px-3 py-2 bg-blue-500 text-white rounded-r-md focus:outline-none hover:bg-blue-600"
            >
              Add Tag
            </button>
          </div>
          <div className="mt-2 space-x-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-gray-700 text-gray-200 text-left rounded-full"
              >
                {tag}{" "}
                <button type="button" onClick={() => handleTagDeletion(tag)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex w-full gap-3">
          {" "}
          <button
            type="submit"
            className="w-full px-3 py-2 bg-green-500 text-white rounded-md focus:outline-none hover:bg-green-600"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full px-3 py-2 bg-red-500 text-white rounded-md focus:outline-none hover:bg-green-600"
          >
            Cancel
          </button>
        </div>
      </form>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Results:</h3>
        <ul>
          {documents.map((document, index) => (
            <div>
              <li key={index} className="border-b py-2">
                {document.document_remarks}
              </li>
              <a href={document.file_url} target="_blank">
                {" "}
                Download
              </a>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileSearch;
