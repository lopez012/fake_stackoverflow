import React, { useState } from 'react';

function QuestionForm({ onQuestionSubmit,user,passedQuestion,change,onDeleteQuestion, ts, onChangeQuestion}) {

  
  const [formData, setFormData] = useState({
    questionTitle: change? passedQuestion.title : '',
    questionText: change? passedQuestion.text : '',
    tags: change? ts: '',
    summary: change? passedQuestion.summary : '',
  });

  const [errors, setErrors] = useState({
    questionTitle: '',
    questionText: '',
    tags: '',
    summary: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = { ...errors };
    const tagList = formData.tags.trim().split(/\s+/);
    if (tagList.length > 5) {
      newErrors.tags = 'Only 5 tags or less allowed';
      hasErrors = true;
  }
  else {
    let i = 0;
    while (!hasErrors && i < tagList.length) {
      if (tagList[i].length >= 10) {
        newErrors.tags = 'No tags can be 10 characters or more';
        hasErrors = true;
      }
      i++;
    }
  }
    if (formData.questionTitle.length > 100) {
      newErrors.questionTitle = 'Title must be 100 characters or less';
      hasErrors = true;
    }
    if (formData.questionTitle.trim() === '') {
      newErrors.questionTitle = 'Title is required';
      hasErrors = true;
    }
    if (formData.questionText.trim() === '') {
      newErrors.questionText = 'Question text is required';
      hasErrors = true;
    }
    if (formData.tags.trim() === '') {
      newErrors.tags = 'Tags are required';
      hasErrors = true;
    }
    if (formData.summary.trim() === '') {
      newErrors.summary = 'Summary is required';
      hasErrors = true;
    }
    if (formData.summary.length > 140) {
      newErrors.summary = 'Summary must be 140 characters or less';
      hasErrors = true;
    }

    const Regex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
    const links = formData.questionText;
    const matches = links.match(Regex);
    
    if (matches) {
      const segments = formData.questionText.split(Regex);

      for (let i = 0; i < matches.length; i++) {
        const linkMatch = matches[i].match(/\((https?:\/\/[^\s)]+)\)/);
        if (!linkMatch || !linkMatch[1] || !(linkMatch[1].startsWith('https://') || linkMatch[1].startsWith('http://'))) {
          newErrors.questionText = 'Invalid hyperlink format or target';
          hasErrors = true;
          break;
        }
        segments.splice(i * 2 + 1, 0, { type: 'link', url: linkMatch[1], text: matches[i] });
      }

      setFormData({ ...formData, questionText: segments });
    }

    if (hasErrors) {
      setErrors(newErrors);
      console.log('error in q form');
    } else {
      console.log(formData.summary);
      if(change){
        onChangeQuestion(passedQuestion,formData)
      }
      else {
        onQuestionSubmit(formData);
      }
    
      // Clear the form and reset errors
      setFormData({
        questionTitle: '',
        questionText: '',
        tags: '',
        summary: '',
      });
      setErrors({
        questionTitle: '',
        questionText: '',
        tags: '',
        summary: '',
      });
    }
  };
  const handleDelete = () => {
    onDeleteQuestion(passedQuestion);
  };

  return (
    <div id="add_question_form">
      <h2>Question Title*</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="questionTitle">Limit title to 100 characters or less</label>
        <br />
        <input
          type="text"
          id="questionTitle"
          name="questionTitle"
          value={formData.questionTitle}
          onChange={handleChange}
        />
        <span id="question_title_error" className="error-message" style={{ color: 'red' }}>
          {errors.questionTitle}
        </span>

        <h2>Question summary*</h2>
        <textarea
          type="text"
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows="5"
          cols="50"
        />
        <br />
        <span id="summary_error" className="error-message" style={{ color: 'red' }}>
          {errors.summary}
        </span>


        <h2>Question Text*</h2>
        <label htmlFor="questionText">Add details:</label>
        <br />
        <textarea
          id="questionText"
          name="questionText"
          value={formData.questionText}
          onChange={handleChange}
          rows="10"
          cols="50"
        ></textarea>
        <span id="question_text_error" className="error-message" style={{ color: 'red' }}>
          {errors.questionText}
        </span>
        <h1>User Rep: {user?user.reputation:''}</h1>
        {user&&
        (<><h2>Tags*</h2>
        <label htmlFor="tags">Add keywords separated by whitespace</label>
        <br />
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
        <span id="tags_error" className="error-message" style={{ color: 'red' }}>
          {errors.tags}
        </span></>)}
        
      
        <br />
      <br />
      <button type="submit">{change ? 'Modify' : 'Post Question'}</button>
      {change && (
        <>
          <button type="button" onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>
            Delete
          </button>
        </>
      )}
      <span style={{ color: 'red' }}> *indicates mandatory fields</span>
      </form>
    </div>
  );
}

export default QuestionForm;
