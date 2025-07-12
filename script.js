document.addEventListener("DOMContentLoaded",function(){
   const searchButton=document.getElementById('btn')
   const usernameInput=document.getElementById('user')
   const statsContainer=document.querySelector('.container-stats')
   const easyProgressCircle=document.querySelector('.progress-easy')
   const mediumProgressCircle=document.querySelector('.progress-medium')
   const hardProgressCircle=document.querySelector('.progress-hard')
   const easyLabel=document.getElementById('easy-label')
   const meduimLabel=document.getElementById('medium-label')
   const hardLabel=document.getElementById('hard-label')
   const cardStatsContainer=document.querySelector('.card-container')





//return true or false based on regular expression (correct username or not)
   function validateUsername(username){
     if(username.trim===" "){
        alert("Username should not be empty")
        return false
        }

        const regx = /^[a-zA-Z0-9_-]{1,15}$/
        const isMatching = regx.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;

   }


   function updateProgress(solved,total,label,circle){
    const progressDegree=(solved/total)*100;
    circle.style.setProperty("--progress-degree",`${progressDegree}%`)
    label.textContent=`${solved}/${total}`;
}



   function displayUserData(parsedData){
    const totalQues=parsedData.totalQuestions
    const totalEasyQues=parsedData.totalEasy
    const totalMediumQues=parsedData.totalMedium
    const totalHardQues=parsedData.totalHard


    const solvedTotalQues=parsedData.totalSolved
    const solvedTotalEasyQues=parsedData.easySolved
    const solvedTotalMediumQues=parsedData.mediumSolved
    const solvedTotalHardQues=parsedData.hardSolved
    

    updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
    updateProgress(solvedTotalMediumQues,totalMediumQues,meduimLabel,mediumProgressCircle);
    updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);



        const Rank=parsedData.ranking;


        const calendar = parsedData.submissionCalendar;
        let totalSubmissions = 0;
        for (let key in calendar) {
            totalSubmissions += calendar[key];
        }
        console.log("total sub: ",totalSubmissions)

        cardStatsContainer.innerHTML=`<div>
                                        <div class="cards">
                                        <h3>Toatl Submissions</h3>
                                        <p>${totalSubmissions}</p>
                                        </div>
                                    

                                        
                                    <div class="cards acceptance">
                                        <h3>Total Questions solved</h3>
                                        <p >${solvedTotalQues}</p>
                                    </div>

                                    


                                    <div class="cards">
                                        <h3>Toatl Questions</h3>
                                            <p>${totalQues}</p>
                                    </div>
                                    

                                    
                                     <div class="cards">
                                        <h3>Rank</h3>
                                            <p>${Rank}</p>
                                    </div>
                                   </div>
                                    
                                    `
                                    
    }





    async function fetchUserdetail(username){
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`

        try{
            searchButton.textContent="Searching..."
            searchButton.disabled=true;

            const response=await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details")
            }
            const parsedData= await response.json();
            console.log("Logging data: ",parsedData)

            displayUserData(parsedData);

        }
        catch(error){
            console.log(error)
            statsContainer.innerHTML=`<p>No data Found</p>`
        }
        finally{
            searchButton.textContent="Search"
            searchButton.disabled=false;
        }
    }




  




    



   searchButton.addEventListener('click',function(){
    const username=usernameInput.value;
    console.log("logged in username: ",username)
     if(validateUsername(username)){
        fetchUserdetail(username)
     }
   })
})