import { useState } from "react";
import axios from "axios";
const Home = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    published: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/post", formData);
      console.log(response.data); // Response from the server
      // Optionally, update UI or take other actions upon successful response
    } catch (error) {
      console.error("Error:", error);
      // Optionally, handle errors or show error messages to the user
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="checkbox"
          name="published"
          checked={formData.published}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
export default Home;
