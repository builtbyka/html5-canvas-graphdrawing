import React from 'react';
import MatrixInput from './MatrixInput.jsx';
import ChartistGraph from 'react-chartist';
import ChartistLegend from './ChartistLegend.jsx';
import Fetch from 'isomorphic-fetch';


class App extends React.Component {
    
     componentDidMount() {
        var sql = encodeURI('SELECT questionID, SUM(cognitive) as cognitive, SUM(affirmative) as affirmative FROM ChartTest GROUP BY questionID');
        fetch('https://ib-ed.tech/api/exercise/'+sql)
            .then(function(response) {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json();
            })
            .then((results) => {
                let series = [];
                results.forEach(
                    result =>{
                        let counter = 0;
                          for(let i in result){
                             if(i !== 'questionID'){
                                  if(series[counter] === undefined){
                                      series.push([]);
                                  }
                                  series[counter].push(result[i]);
                                  counter ++;
                              }
                          }
                    }
                )
                this.setState({series : series})
            });
    }

    componentWillUnmount() {
        //this is fine but overkill for the mo.
        //this.serverRequest.abort();
    }

	constructor(props){
		super(props);
        let env = this.getEnv();
        this.state = {
                    options : ['cognitive', 'affirmative'],
                    inptype : 'radio',
                    labels : ['date','gift','movie'],
                    graphOps : {},
                    type : 'Bar',
                    answers : [],
                    series: [],
                    enviroment: env,
                    userID: this.getUser(env),
                    instanceID:'TEST01',
                    versionID:'0.1.1',
                    timeStampUTC:'1457696167',
                    ip:'1.1.1.1',
                };
        this.updateSeries = this.updateSeries.bind(this);
        this.updateAnswers = this.updateAnswers.bind(this);
	}
    
    getEnv(){
        function Env(env) {
            return window.location.href.indexOf(env) > 1;
        }
        switch (true) {
            case Env("edx"):
                return 'edx';
                break;
            case Env("hub"):
                return 'hub';
                break;
            default:
                return 'test';
        }
    }
    
    getUser(env){
        switch (env) {
            case 'edx':
                let user;
                if(document.getElementsByClassName("label-username").length > 0){
                    user = document.getElementsByClassName("label-username")[0].innerHTML;
                }else{
                    user = document.getElementsByClassName("account-username")[0].innerHTML;
                }
                return user;
                break;
            case 'hub':
                return 'hub';
                break;
            default:
                return 'testUser';
                break;
        }
    }
  
    
    updateSeries(e){
            let seriesOption,
            seriesLabel,
            seriesCopy = this.state.series.slice(0),
            submission = [
            ];
        
        //Update series and submission data
        
        this.state.answers.forEach(
            answer => {
                let submissionSegment = {userID: this.state.userID,
                instanceID:this.state.instanceID,
                versionID:this.state.versionID,
                enviroment:this.state.enviroment}
                // loops through the options (cog or aff in example) and maps where in array it is
                this.state.options.forEach(function(value, i){
                    if(value === answer.value){
                        seriesOption = i;
                        submissionSegment[value] = 1;
                    } else{
                        submissionSegment[value] = 0;
                    } 
                })
                //loop through labels (example date, gift, movie)
                 this.state.labels.forEach(function(value, i){
                    if(value === answer.name){
                        seriesLabel = i;
                    }   
                })
               // if data to begin with, add 1 to it, if not push new instance to array
                if(seriesCopy.length > 0){
                     seriesCopy[seriesOption][seriesLabel] += 1;
                }else{
                     for(var j=0; j < this.state.options.length; j++){
                         seriesCopy.push(j); 
                         var arr = [];
                        for(var k=0; k < this.state.labels.length; k++){
                            arr.push(0);
                        }
                        seriesCopy[j] = arr;
                    }
                    seriesCopy[seriesOption][seriesLabel] += 1;
                }
                 submissionSegment.questionID = answer.name;
                 submission.push(submissionSegment);
            }
        )
        
        //update the page
        
        this.setState({series: seriesCopy});
       
        //send data
        
        fetch('https://ib-ed.tech/api/exercise/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(submission)
        }).then(response => console.log(response))
        
      
    }
  
    updateAnswers(e){
        let name = e.currentTarget.name,
            value = e.currentTarget.value,
            answersCopy = this.state.answers.slice(0),
            found = false;
            answersCopy.forEach(
                answer => {
                    if(name === answer.name){
                        answer.value = value;
                        found = true;
                    }
                }
            )
       
        if(found === false){
             answersCopy.push({name:name, value:value});
        }
        
        this.setState({answers:answersCopy});
        
    }

	render(){
		return (
			<div style={styles.body}>
                  <MatrixInput options={this.state.options} type={this.state.inptype} questions={this.state.labels} updateAnswers={this.updateAnswers} updateSeries={this.updateSeries}/>
                  <div style={styles.chart}>
                    <ChartistGraph data={this.state} options={this.state.graphOps} type={this.state.type} />
                  </div>
                  <ChartistLegend style="width: 20%" type={this.state.type} legend={this.state.options}/>
			</div>
		)
	}
}

let styles = {
    
    body : {
        overflow: 'auto'  
    },
    
    chart : {
        float: 'left',
         marginRight: '2%',
        width: '85%',
    }
    
}

export default App