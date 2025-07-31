document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("btn");
  const usernameInput = document.getElementById("user");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const easyCircle = document.getElementById("easy");
  const mediumCircle = document.getElementById("medium");
  const hardCircle = document.getElementById("hard");
  const cardStatsContainer = document.querySelector(".card-container");

  // Validate username
  function validateUsername(username) {
    if (!username.trim()) {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    if (!regex.test(username)) {
      alert("Invalid username");
      return false;
    }
    return true;
  }

  // Update progress UI
  function updateProgress(solved, total, label, circle) {
    const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);
    circle.style.background = `conic-gradient(var(--light-grey) ${percentage}%, #555 ${percentage}%)`;
    label.textContent = `${solved}/${total}`;
  }

  // Display card stats
  function displayUserData(data) {
    const {
      totalQuestions,
      totalSolved,
      totalEasy,
      totalMedium,
      totalHard,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking,
      submissionCalendar
    } = data;

    let totalSubmissions = 0;
    for (const key in submissionCalendar) {
      totalSubmissions += submissionCalendar[key];
    }

    updateProgress(easySolved, totalEasy, easyLabel, easyCircle);
    updateProgress(mediumSolved, totalMedium, mediumLabel, mediumCircle);
    updateProgress(hardSolved, totalHard, hardLabel, hardCircle);

    cardStatsContainer.innerHTML = `
      <div class="cards">
        <h3>Total Submissions</h3>
        <p>${totalSubmissions}</p>
      </div>
      <div class="cards">
        <h3>Total Solved</h3>
        <p>${totalSolved}</p>
      </div>
      <div class="cards">
        <h3>Total Questions</h3>
        <p>${totalQuestions}</p>
      </div>
      <div class="cards">
        <h3>Ranking</h3>
        <p>${ranking}</p>
      </div>
    `;
  }

  // Fetch data from API
  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      if (!data || data.status === "error") {
        cardStatsContainer.innerHTML = `<p>No data found.</p>`;
        return;
      }

      displayUserData(data);
    } catch (err) {
      console.error(err);
      cardStatsContainer.innerHTML = `<p>No data found.</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  // Event listener
  searchButton.addEventListener("click", function () {
    const username = usernameInput.value.trim();
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
