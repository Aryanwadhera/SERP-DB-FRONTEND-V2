import React from 'react';

const SubmitProjectPage = () => {
  return (
    <div className="max-w-lg mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">Submit a New Project</h1>
      <form className="space-y-4">
        <input 
          type="text" 
          placeholder="Project Title" 
          className="input input-bordered w-full"
        />
        <textarea 
          placeholder="Project Description" 
          className="textarea textarea-bordered w-full"
          rows={5}
        ></textarea>
        <input 
          type="text" 
          placeholder="Project Image URL" 
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">Submit</button>
      </form>
    </div>
  );
};

export default SubmitProjectPage;
