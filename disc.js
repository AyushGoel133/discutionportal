function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

let questionsList = JSON.parse(localStorage.getItem("questions")) || [];
let responses = JSON.parse(localStorage.getItem("responses")) || {};

let navbar = createNavBar();
let leftdiv = createLeftDiv();
let rightdiv = createRightDiv();
let newForm = createqueryForm();

document.body.appendChild(navbar);
document.body.appendChild(leftdiv);
document.body.appendChild(rightdiv);
document.body.appendChild(newForm);

newForm.style.display = "none";
newForm.id = "quesRespone";

window.addEventListener("DOMContentLoaded", () => {
  let questionsContainer = document.getElementById("questionsContainer");
  questionsList.forEach((question, index) => {
    let questionElement = createQueCont(question.subject,question.question,index,question.date);
    questionsContainer.appendChild(questionElement);
  });

  document.getElementById("search").addEventListener("click", function () {
    document.getElementById("rightDiv").style.display = "block";
    document.getElementById("quesRespone").style.display = "none";
  });

  document.getElementById("taskTitleInput").addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const questions = document.querySelectorAll("#questionsContainer > div");
      let hasMatches = false;

      questions.forEach((question) => {
        const text = question.innerText.toLowerCase();
        if (text.includes(searchTerm)) {
          question.style.display = "block";
          hasMatches = true;
        } else {
          question.style.display = "none";
        }
      });

      const noMatchMessage = document.getElementById("noMatchMessage");
      if (!hasMatches && searchTerm !== "") {
        if (!noMatchMessage) {
          const messageDiv = document.createElement("div");
          messageDiv.id = "noMatchMessage";
          messageDiv.className = "p-4 text-center text-gray-500 text-xl";
          messageDiv.textContent = "No Match Found";
          document.getElementById("questionsContainer").appendChild(messageDiv);
        }
      } else if (noMatchMessage) {
        noMatchMessage.remove();
      }
    });
});

function createNavBar() {
  let navBar = document.createElement("div");
  navBar.id = "navigationBar";
  navBar.className = "bg-teal-600 text-white text-[50px] p-4";
  navBar.textContent = "Discussion Portal";
  return navBar;
}

function createLeftDiv() {
  let leftdiv = document.createElement("div");
  leftdiv.id = "leftDiv";
  leftdiv.className = "border-r h-[760px] w-[40%] absolute";

  let searchdiv = createSearchDiv();
  let quecont = document.createElement("div");
  quecont.id = "questionsContainer";

  leftdiv.appendChild(searchdiv);
  leftdiv.appendChild(quecont);

  return leftdiv;
}

function createSearchDiv() {
  let searchdiv = document.createElement("div");
  searchdiv.id = "searchbox";
  searchdiv.className = "border-b h-[15%] p-4";

  let searchbtn = document.createElement("button");
  searchbtn.id = "search";
  searchbtn.className =
    "w-[200px] h-[50px] m-2 font text-lg cursor-pointer rounded bg-blue-600 text-white border-none";
  searchbtn.textContent = "New Question Form";

  let searchcont = document.createElement("input");
  searchcont.id = "taskTitleInput";
  searchcont.className = "w-[200px] h-[50px] rounded border p-2 m-2";
  searchcont.placeholder = "search questions...";

  searchdiv.appendChild(searchbtn);
  searchdiv.appendChild(searchcont);
  return searchdiv;
}

function createQueCont(sub, que, index, date) {
  let questionDiv = document.createElement("div");
  questionDiv.className = "p-4 bg-gray-50 border-b";
  questionDiv.dataset.index = index;

  let subdisplay = document.createElement("h2");
  subdisplay.innerText = sub;
  subdisplay.className =
    "font-bold text-[20px] mb-2 text-gray-600 cursor-pointer";

  let quedisplay = document.createElement("p");
  quedisplay.innerText = que;
  quedisplay.className = "text-gray-700 text-base cursor-pointer";

  let dateDisplay = document.createElement("div");
  dateDisplay.className = "text-xs text-gray-500 mt-2";
  dateDisplay.textContent = formatDate(date);

  questionDiv.addEventListener("click", () => {
    let existingForm = document.getElementById("quesRespone");
    if (existingForm) {
      existingForm.remove();
    }

    let q = createqueryForm(sub, que, index);
    q.id = "quesRespone";
    document.body.appendChild(q);
    document.getElementById("rightDiv").style.display = "none";
    q.style.display = "block";
  });

  questionDiv.appendChild(subdisplay);
  questionDiv.appendChild(quedisplay);
  questionDiv.appendChild(dateDisplay);

  return questionDiv;
}

function createqueryForm(sub, que, index) {
  let quesresp = document.createElement("div");
  quesresp.className = "h-[100%] w-[60%] ml-[40%] p-4";
  quesresp.dataset.index = index;

  let head = document.createElement("h1");
  head.className = "text-[30px] text ml-[10%] mt-[5%] text-gray-500";
  head.innerText = "Question";

  let dispquesub = document.createElement("div");
  dispquesub.className =
    "h-auto w-[700px] border bg-gray-200 ml-[10%] border-none p-4 mb-4";
  let subj = document.createElement("h1");
  subj.innerText = sub;
  subj.className = "font-bold text-lg";

  let queText = document.createElement("p");
  queText.innerText = que;
  queText.className = "mt-2";

  let questionDate = document.createElement("div");
  questionDate.className = "text-sm text-gray-500 mt-2";
  questionDate.textContent = `Posted on: ${formatDate(
    questionsList[index]?.date
  )}`;

  let resolvebtn = document.createElement("button");
  resolvebtn.className =
    "w-[200px] h-[50px] m-5 font text-lg cursor-pointer rounded bg-blue-600 text-white border-none ml-[68%]";
  resolvebtn.textContent = "Resolve";

  resolvebtn.addEventListener("click", () => {
    questionsList.splice(index, 1);
    localStorage.setItem("questions", JSON.stringify(questionsList));

    delete responses[index];
    localStorage.setItem("responses", JSON.stringify(responses));

    document.getElementById("questionsContainer").innerHTML = "";
    questionsList.forEach((question, i) => {
      let questionElement = createQueCont(question.subject,question.question,i,question.date);
      document.getElementById("questionsContainer").appendChild(questionElement);
    });

    document.getElementById("rightDiv").style.display = "block";
    document.getElementById("quesRespone").remove();
  });

  let responsetext = document.createElement("h1");
  responsetext.className = "text-[20px] text ml-[10%] text-gray-500 mt-4";
  responsetext.innerText = "Response";

  let responsesContainer = document.createElement("div");
  responsesContainer.id = "responsesContainer";
  responsesContainer.className = "ml-[10%] mt-2";

  if (responses[index]) {
    responses[index].forEach((response, responseIndex) => {
      let responseDiv = document.createElement("div");
      responseDiv.className = "border-b p-4 bg-gray-100 mb-2";
      responseDiv.dataset.responseIndex = responseIndex;

      let nameDiv = document.createElement("div");
      nameDiv.className = "font-bold";
      nameDiv.textContent = response.name;

      let responseDate = document.createElement("div");
      responseDate.className = "text-xs text-gray-500";
      responseDate.textContent = formatDate(response.date);

      let commentDiv = document.createElement("div");
      commentDiv.className = "mt-2";
      commentDiv.textContent = response.comment;

      let likeDislikeContainer = document.createElement("div");
      likeDislikeContainer.className = "flex items-center mt-2";

      let likeButton = document.createElement("button");
      likeButton.className =
        "border-none cursor-pointer h-10 w-10 text-2xl flex items-center justify-center";
      likeButton.innerHTML = "👍";
      likeButton.title = "Like";

      let likeCount = document.createElement("span");
      likeCount.className = "mx-2";
      likeCount.textContent = response.likes || 0;

      let dislikeButton = document.createElement("button");
      dislikeButton.className =
        "border-none cursor-pointer h-10 w-10 text-2xl flex items-center justify-center";
      dislikeButton.innerHTML = "👎";
      dislikeButton.title = "Dislike";

      let dislikeCount = document.createElement("span");
      dislikeCount.className = "mx-2";
      dislikeCount.textContent = response.dislikes || 0;

      let replyButton = document.createElement("button");
      replyButton.className = "ml-4 text-blue-600 cursor-pointer";
      replyButton.textContent = "Reply";

      replyButton.addEventListener("click", () => {
        let replyForm = document.createElement("div");
        replyForm.className = "mt-2 ml-4 p-2 bg-gray-50";

        let replyInput = document.createElement("textarea");
        replyInput.className = "w-full p-2 border border-gray-300";
        replyInput.placeholder = "Write your reply...";
        replyInput.rows = 2;

        let submitReply = document.createElement("button");
        submitReply.className =
          "mt-2 ml-[76%] px-4 py-1 bg-blue-600 text-white rounded";
        submitReply.textContent = "Submit";

        submitReply.addEventListener("click", () => {
          if (!replyInput.value.trim()) return;

          if (!response.replies) {
            response.replies = [];
          }

          response.replies.push({
            name: "Guest",
            comment: replyInput.value,
            date: new Date().toISOString(),
          });

          localStorage.setItem("responses", JSON.stringify(responses));

          let existingForm = document.getElementById("quesRespone");
          if (existingForm) {
            existingForm.remove();
          }
          let q = createqueryForm(sub, que, index);
          q.id = "quesRespone";
          document.body.appendChild(q);
          document.getElementById("rightDiv").style.display = "none";
          q.style.display = "block";
        });

        replyForm.appendChild(replyInput);
        replyForm.appendChild(submitReply);

        let existingReplyForm = responseDiv.querySelector(".reply-form");
        if (existingReplyForm) {
          existingReplyForm.remove();
        } else {
          responseDiv.appendChild(replyForm);
        }
      });

      likeButton.addEventListener("click", () => {
        if (!response.likes) response.likes = 0;
        response.likes++;
        likeCount.textContent = response.likes;
        localStorage.setItem("responses", JSON.stringify(responses));
      });

      dislikeButton.addEventListener("click", () => {
        if (!response.dislikes) response.dislikes = 0;
        response.dislikes++;
        dislikeCount.textContent = response.dislikes;
        localStorage.setItem("responses", JSON.stringify(responses));
      });

      likeDislikeContainer.appendChild(likeButton);
      likeDislikeContainer.appendChild(likeCount);
      likeDislikeContainer.appendChild(dislikeButton);
      likeDislikeContainer.appendChild(dislikeCount);
      likeDislikeContainer.appendChild(replyButton);

      responseDiv.appendChild(nameDiv);
      responseDiv.appendChild(responseDate);
      responseDiv.appendChild(commentDiv);
      responseDiv.appendChild(likeDislikeContainer);

      if (response.replies && response.replies.length > 0) {
        let repliesContainer = document.createElement("div");
        repliesContainer.className =
          "ml-4 mt-2 border-l-2 border-gray-300 pl-2";

        response.replies.forEach((reply) => {
          let replyDiv = document.createElement("div");
          replyDiv.className = "mb-2 p-2 bg-gray-50";

          let replyName = document.createElement("div");
          replyName.className = "font-bold text-sm";
          replyName.textContent = reply.name;

          let replyDate = document.createElement("div");
          replyDate.className = "text-xs text-gray-500";
          replyDate.textContent = formatDate(reply.date);

          let replyText = document.createElement("div");
          replyText.className = "text-sm";
          replyText.textContent = reply.comment;

          replyDiv.appendChild(replyName);
          replyDiv.appendChild(replyDate);
          replyDiv.appendChild(replyText);
          repliesContainer.appendChild(replyDiv);
        });

        responseDiv.appendChild(repliesContainer);
      }

      responsesContainer.appendChild(responseDiv);
    });
  }

  let addtext = document.createElement("h1");
  addtext.className = "text-[20px] text ml-[10%] mt-[5%] text-gray-500";
  addtext.innerText = "Add Response";

  let ename = document.createElement("input");
  ename.id = "username";
  ename.className =
    "border border-gray-300 ml-[10%] mt-[2%] h-10 block p-2 w-[200px]";
  ename.placeholder = "Enter Name";

  let comment = document.createElement("textarea");
  comment.id = "usercomment";
  comment.className =
    "border border-gray-300 ml-[10%] mt-[2%] h-30 w-[700px] p-2";
  comment.placeholder = "Enter Comment";
  comment.rows = 4;

  let subbtn = document.createElement("button");
  subbtn.className =
    "w-[200px] h-[50px] m-5 ml-[69%] font text-lg cursor-pointer rounded bg-blue-600 text-white border-none ml-[68%]z";
  subbtn.innerText = "Submit";

  subbtn.addEventListener("click", () => {
    const name = ename.value;
    const commentText = comment.value;

    if (!name || !commentText) {
      alert("Please enter both name and comment");
      return;
    }

    if (!responses[index]) {
      responses[index] = [];
    }

    responses[index].push({
      name: name,
      comment: commentText,
      likes: 0,
      dislikes: 0,
      replies: [],
      date: new Date().toISOString(),
    });

    localStorage.setItem("responses", JSON.stringify(responses));

    let existingForm = document.getElementById("quesRespone");
    if (existingForm) {
      existingForm.remove();
    }
    let q = createqueryForm(sub, que, index);
    q.id = "quesRespone";
    document.body.appendChild(q);
    document.getElementById("rightDiv").style.display = "none";
    q.style.display = "block";

    ename.value = "";
    comment.value = "";
  });

  dispquesub.appendChild(subj);
  dispquesub.appendChild(questionDate);
  dispquesub.appendChild(queText);

  quesresp.appendChild(head);
  quesresp.appendChild(dispquesub);
  quesresp.appendChild(resolvebtn);
  quesresp.appendChild(responsetext);
  quesresp.appendChild(responsesContainer);
  quesresp.appendChild(addtext);
  quesresp.appendChild(ename);
  quesresp.appendChild(comment);
  quesresp.appendChild(subbtn);

  return quesresp;
}

function createRightDiv() {
  let rightdiv = document.createElement("div");
  rightdiv.id = "rightDiv";
  rightdiv.className = "h-[760px] w-[60%] ml-[40%] p-8";

  let bigtext = document.createElement("h1");
  bigtext.innerText = "Welcome to Discussion Portal !";
  bigtext.className = "font-bold text-[30px] mt-[5%] text-gray-600";

  let smalltext = document.createElement("h1");
  smalltext.innerText = "Enter a subject and question to get started";
  smalltext.className = "text-lg mt-2 text-gray-500";

  let input = document.createElement("input");
  input.id = "subject";
  input.className = "w-60 h-[50px] border border-gray-300 mt-[2%] p-2 block";
  input.placeholder = "Subject";

  let quet = document.createElement("textarea");
  quet.id = "questions";
  quet.className = "w-full h-[200px] border border-gray-300 mt-[2%] p-2";
  quet.placeholder = "Question";
  quet.rows = 8;

  let submitbtn = document.createElement("button");
  submitbtn.id = "submit";
  submitbtn.className =
    "w-[200px] h-[50px] mt-4 ml-[76%] font text-lg cursor-pointer rounded bg-blue-600 text-white border-none";
  submitbtn.textContent = "Submit";

  submitbtn.addEventListener("click", () => {
    const sub = input.value;
    const que = quet.value;
    if (sub == "" || que == "") {
      alert("Enter the proper detail !!!");
      return;
    }
    const newQuestion = {subject: sub,question: que,date: new Date().toISOString(),};
    questionsList.push(newQuestion);

    localStorage.setItem("questions", JSON.stringify(questionsList));

    let questionElement = createQueCont(sub,que,questionsList.length - 1,newQuestion.date
    );
    document.getElementById("questionsContainer").appendChild(questionElement);

    input.value = "";
    quet.value = "";
    input.focus();
  });

  rightdiv.appendChild(bigtext);
  rightdiv.appendChild(smalltext);
  rightdiv.appendChild(input);
  rightdiv.appendChild(quet);
  rightdiv.appendChild(submitbtn);

  return rightdiv;
}
