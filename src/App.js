import React from "react"
import './App.css';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from "react";
import { useEffect } from "react";
import Infobox from "./components/Infobox/Infobox";
import { Card, CardContent } from "@mui/material";
import Table from "./components/Table/Table";
import { prettyPrintStat, sortData } from "./components/utilities/util";
import numeral from "numeral";

function App() {
  const[countries,setCountries] = useState([])
  const[country,setCountry] = useState("worldwide");
  const[countryInfo, SetCountryInfo] = useState({});
  const[tableData,setTableData]=useState([]);

  useEffect(() =>{
   fetch("https://disease.sh/v3/covid-19/all")
    .then((res) => res.json())
    .then((data) =>{
      SetCountryInfo(data);
    } );
  },[]);
  

  useEffect(() =>{
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(res =>res.json())
      .then(data => {
        const countries = data.map((country) =>(
          {
            name:country.country,
            value:country.countryInfo.iso2
          }
        ));
        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries);

      });

    };
    getCountriesData();


  },[])

  const onCountryChange = e =>{
    const countryCode = e.target.value;
   
    const url = 
    countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        fetch(url)
        .then(res => res.json())
        .then(data =>{
          setCountry(countryCode);
          SetCountryInfo(data);
        })
  };
  console.log(countryInfo);

  return (
    
    <div className="app">
    <div className="app_left">
    <div className="app_header">
        <h1>Covid-19 tracker!!! </h1>
  
        <FormControl className="app_dropdown">
 
 <Select
 onChange={onCountryChange}
 variant="outlined"
 value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
   {
     countries.map((country) =>(
  

       <MenuItem 
       value={country.value}>{country.name}</MenuItem>

     ))
   }

 </Select>
</FormControl>  
     
    </div>

    <div className="app_stats">
      <Infobox  title="Coronavirus cases"  cases={prettyPrintStat(countryInfo.todayCases)} total= {numeral(countryInfo.cases).format("0,0")}/>

      <Infobox title=  "Recovered" cases={prettyPrintStat(countryInfo.todayRecovered
      )} total= {numeral(countryInfo.recovered).format("0,0")}  />

      <Infobox  title="Death" cases={prettyPrintStat(countryInfo.todayDeaths)} total={numeral(countryInfo.deaths).format("0,0")}/>
    </div>
    </div>


    <Card className="app_right">
      <CardContent>
        <h3>Live cases by country</h3>
        <Table countries={tableData}/>
        <h3>WorldWide new cases</h3>
      </CardContent>
      
    </Card>
    </div>
  );
}

export default App;
