var start = false;
var startExploration;

var activeIndex = -1;
var selectedRegionIndex = -1
var currentPipeline = [];
var currentOperatorResults = [];

function selectHypothesis(hypothesisIndex) {
  activeIndex = hypothesisIndex;
  selectRegion(0);
}

function selectRegion(regionIndex) {
  selectedRegionIndex = regionIndex;
}

async function callAgent(policy, selectedGroup, listRegions, aggregation) {
    var requestBody = {};

    if (policy !== undefined) {
        requestBody["policy"] = policy;
    }

    if (selectedGroup !== undefined) {
        requestBody["selected_group"] = selectedGroup;
    }

    if (listRegions !== undefined) {
        requestBody["list_regions"] = listRegions;
    }

    if (aggregation !== undefined) {
        requestBody["aggregation"] = aggregation;
    }

    const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    // waits until the request completes...
    const data = await response.json();

    return data;
}

function updateBreadcrumbs(){
  let breadcrumbsElement = document.querySelector('#breadcrumbElements');
  let html = '';
  if (currentOperatorResults.length > 0) {
    for (let i = 0; i < currentOperatorResults[activeIndex][selectedRegionIndex]['breadcrumbs'].length; i++) {
      html += `<li class="breadcrumb-item active">${currentOperatorResults[activeIndex][selectedRegionIndex]['breadcrumbs'][i]}</li>`;
    }
  } else {
    html += `<li class="breadcrumb-item active">Empty pipeline</li>`;
  }
  breadcrumbsElement.innerHTML = html;
}

function updateCurrentPipeline(){
    let currentPipelineElement = document.querySelector('#currentPipeline');
    let html = '';

    for (let i = currentPipeline.length - 1; i >= 0; i--) {
        html +=
        `<a onclick="selectHypothesis(${i});updateCurrentPipeline();updateCurrentOperatorResults();" class="list-group-item list-group-item-action d-flex gap-3 py-3 ${(i == activeIndex ? 'active' : '')}" aria-current="true">
        <img src="${(currentPipeline[i]['action'] == 'Exploit' ? '2.png' : '3.png')}" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
          <div class="d-flex gap-2 w-100 justify-content-between">
            <div>
                <h6 class="mb-0">${currentPipeline[i]['name']}</h6>
            
                <p class="mb-0 opacity-75">${currentPipeline[i]['user_count']} ${(currentPipeline[i]['user_count'] == 1 ? 'user' : 'users')}, ${currentPipeline[i]['movie_count']} ${(currentPipeline[i]['movie_count'] == 1 ? 'movie' : 'movies')}</p>
                <p class="mb-0 opacity-75">FDR: ${currentPipeline[i]['fdr']} | Power: ${currentPipeline[i]['power']} | Coverage: ${currentPipeline[i]['coverage']}</p>
                
            </div>
            <small class="opacity-50 text-nowrap">${currentPipeline[i]['size_output_set']} output ${(currentPipeline[i]['size_output_set'] == 1 ? 'region' : 'regions')}</small>
          </div>
        </a>`;
    }

    // Add the HTML to the UI
    currentPipelineElement.innerHTML = html;
    updateBreadcrumbs();
}

function updateCurrentOperatorResults(){
    let currentOperatorResultsElement = document.querySelector('#currentOperatorResults');
    let html = '';

    if (currentOperatorResults.length > 0) {
        for (let i = 0; i < currentOperatorResults[activeIndex].length; i++) {
            html +=
            `<div class="accordion-item overflow-auto">
            <h2 class="accordion-header" id="${currentOperatorResults[activeIndex][i]['heading_id']}">
                <button onclick="selectRegion(${i});updateBreadcrumbs();" class="accordion-button ${(i == 0 ? 'collapsed' : '')}" type="button" data-bs-toggle="collapse" data-bs-target="#${currentOperatorResults[activeIndex][i]['collapse_id']}" aria-expanded="${(i == 0 ? 'true' : 'false')}" aria-controls="${currentOperatorResults[activeIndex][i]['collapse_id']}">
                ${(i == 0 ? 'INPUT DATA REGION<br>' : '')}
                ${currentOperatorResults[activeIndex][i]['name']}
              </button>
            </h2>
            <div id="${currentOperatorResults[activeIndex][i]['collapse_id']}" class="accordion-collapse collapse ${(i == 0 ? 'show' : '')}" aria-labelledby="${currentOperatorResults[activeIndex][i]['heading_id']}" data-bs-parent="#currentOperatorResults">
              <div class="accordion-body overflow-auto">`;
    
            html +=
            `<!-- Ratings -->
    
                <div>
                  <canvas id="${currentOperatorResults[activeIndex][i]['heading_id']}RatingsChart"></canvas>
                </div>
                <script>
                
                  new Chart(document.getElementById("${currentOperatorResults[activeIndex][i]['heading_id']}RatingsChart"), {
                    type: 'bar',
                    data: {
                    labels: ['1', '2', '3', '4', '5'],
                    datasets: [{
                      label: 'Rating count',
                      backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
                      data: [${currentOperatorResults[activeIndex][i]['rating_count']}],
                      borderWidth: 1
                    }]
                  },
                    options: {
                      plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: 'Ratings'
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        },
                      }
                    }
                    }
                  });
                </script>
    
                <!-- Genders -->
    
                <div>
                  <canvas id="${currentOperatorResults[activeIndex][i]['heading_id']}GendersChart"></canvas>
                </div>
                
                <script>
                
                  new Chart(document.getElementById("${currentOperatorResults[activeIndex][i]['heading_id']}GendersChart"), {
                    type: 'bar',
                    data: {
                    labels: ['Male', 'Female'],
                    datasets: [{
                      label: 'User count',
                      backgroundColor: ['#1f77b4', '#ff7f0e'],
                      data: [${currentOperatorResults[activeIndex][i]['genders']}],
                      borderWidth: 1
                    }]
                  },
                    options: {
                      plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: 'Genders'
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        },
                      }
                    }
                    }
                  });
                </script>
    
                <!-- Ages -->
    
                <div>
                  <canvas id="${currentOperatorResults[activeIndex][i]['heading_id']}AgesChart"></canvas>
                </div>
                
                <script>
                
                  new Chart(document.getElementById("${currentOperatorResults[activeIndex][i]['heading_id']}AgesChart"), {
                    type: 'bar',
                    data: {
                    labels: ["<18", "18-24", "25-34", "35-44", "45-49", "50-55", ">56"],
                    datasets: [{
                      label: 'User count',
                      backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2'],
                      data: [${currentOperatorResults[activeIndex][i]['ages']}],
                      borderWidth: 1
                    }]
                  },
                    options: {
                      plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: 'Ages'
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        },
                      }
                    }
                    }
                  });
                </script>
    
                <!-- Occupations -->
    
                <div>
                  <canvas id="${currentOperatorResults[activeIndex][i]['heading_id']}OccupationsChart"></canvas>
                </div>
    
                <script>
    
                  new Chart(document.getElementById("${currentOperatorResults[activeIndex][i]['heading_id']}OccupationsChart"), {
                    type: 'bar',
                    data: {
                    labels: ['Academic-educator', 'Artist', 'Clerical-admin', 'College-grad student', 'Customer service', 'Doctor-health care', 'Executive-managerial', 'Farmer', 'Homemaker', 'K-12 student', 'Lawyer', 'Programmer', 'Retired', 'Sales-marketing', 'Scientist', 'Self-employed', 'Technician-engineer', 'Tradesman-craftsman', 'Unemployed', 'Writer', 'Other'],
                    datasets: [{
                      label: 'User count',
                      backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#1f77b4'],
                      data: [${currentOperatorResults[activeIndex][i]['occupations']}],
                      borderWidth: 1
                    }]
                  },
                    options: {
                      plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: 'Occupations'
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        },
                      }
                    }
                    }
                  });
                </script>
    
                <!-- Genres -->
    
                <div>
                  <canvas id="${currentOperatorResults[activeIndex][i]['heading_id']}GenresChart"></canvas>
                </div>
    
                <script>
    
                  new Chart(document.getElementById("${currentOperatorResults[activeIndex][i]['heading_id']}GenresChart"), {
                    type: 'bar',
                    data: {
                    labels: ['Action', 'Adventure', 'Animation', "Children's", 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'],
                    datasets: [{
                      label: 'User count',
                      backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'],
                      data: [${currentOperatorResults[activeIndex][i]['genres']}],
                      borderWidth: 1
                    }]
                  },
                    options: {
                      plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: 'Genres'
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        },
                      }
                    }
                    }
                  });
                </script>
    
    
              </div>
                </div>
            </div>`;
        }
    }

    currentOperatorResultsElement.innerHTML = html;

    var scripts = currentOperatorResultsElement.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
        eval(scripts[i].innerText);
    }
    updateBreadcrumbs();
}

function nextStepExploration(triggeredByNext=false){
    if (triggeredByNext) {
      document.getElementById("next").classList.add('disabled');
    }

    var policy = document.getElementById("policy").value;
    var selectedGroup;
    var listRegions;
    var aggregation;

    if (currentPipeline.length > 0) {
      selectedGroup = currentOperatorResults[activeIndex][selectedRegionIndex]['data_region'];
      if (selectedRegionIndex == 0) {
        listRegions = currentPipeline[activeIndex]['output_data_regions'];
      }
      aggregation = currentPipeline[activeIndex]['aggregation'];
    }

    callAgent(policy, selectedGroup, listRegions, aggregation).then(data => {
        if (start || triggeredByNext) {
          currentOperatorResults.push(data['operator_results']);
          currentPipeline.push(data['pipeline']);
          activeIndex = currentPipeline.length - 1;
          selectedRegionIndex = 0;

          updateCurrentPipeline();
          updateCurrentOperatorResults();
          if (triggeredByNext) {
            document.getElementById("next").classList.remove('disabled');
          }
        }
        
    });
}

function startOrStopButton(){
    start = !start;

    if (start) {
        // Start exploration
        document.getElementById("startStop").textContent = 'Stop';
        document.getElementById("startStop").className = 'btn btn-outline-warning me-2';

        document.getElementById("next").classList.add('disabled');

        startExploration = setInterval(function(){
            nextStepExploration();
        }, 2000);
    } else {
        // Stop exploration
        document.getElementById("startStop").textContent = 'Start';
        document.getElementById("startStop").className = 'btn btn-outline-success me-2';

        document.getElementById("next").classList.remove('disabled');

        clearInterval(startExploration);
    }
    
    // document.getElementById("msg").innerHTML = "The button has been clicked.";
}

function nextButton(){
  nextStepExploration(true);
}

function resetButton(){
    activeIndex = -1;
    selectedRegionIndex = 0;
    currentPipeline = [];
    currentOperatorResults = [];

    updateCurrentPipeline();
    updateCurrentOperatorResults();
}

const readFile = (file = {}, method = 'readAsText') => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader[method](file)
    reader.onload = () => {
      resolve(reader)
    }
    reader.onerror = (error) => reject(error)
  })
}

async function loadPipeline() {
  let file = document.getElementById("upload").files[0];
  const resp = await readFile(file);
  var data =  JSON.parse(resp.result);
  currentPipeline = data[0];
  currentOperatorResults = data[1];
  activeIndex = currentPipeline.length - 1;
  selectedRegionIndex = 0;
  updateCurrentPipeline();
  updateCurrentOperatorResults();
  document.getElementById('upload').value = "";
}

document.getElementById("upload").onchange = function() {
  loadPipeline();
};

function downloadPipeline() {
  var a = document.createElement("a");
  // var file = new Blob(JSON.stringify({'current_pipeline': currentPipeline, 'current_operator_results': currentOperatorResults}));
  var file = new Blob([JSON.stringify([currentPipeline, currentOperatorResults])]);
  a.href = URL.createObjectURL(file);
  a.download = 'file.sheva';
  a.click();
}

// Get reference to button and add event listener for action "click"
document.getElementById("startStop").addEventListener("click", startOrStopButton);
document.getElementById("next").addEventListener("click", nextButton);
document.getElementById("reset").addEventListener("click", resetButton);
