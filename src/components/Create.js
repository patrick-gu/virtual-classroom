import React from "react";

const Create = () => {
  return (
    <div className="container mt-3 text-center">
      <form>
          <h3 className="">Class Room Name</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
};

export default Create;
