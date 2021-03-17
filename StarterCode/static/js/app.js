function FetchData(sample){
    d3.json("../data/samples.json").then((data) => {
        var metadata = data.metadata;
        var array_data = metadata.filter(item => item.id == sample);
        var result = array_data[0]
        console.log(result)
        var sample_demo = d3.select("#sample-metadata");

        sample_demo.html("");
        Object.entries(result).forEach(([key,value]) => {
            sample_demo.append('h6').text(`${key}: ${value}`);
        });
    });
}


function builtCharts(sample){
    d3.json("../data/samples.json").then((data) => {
        var array_data = data.samples.filter(item => item.id == sample);
        var result = array_data[0]; 

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        var sorted_values = values.sort((a,b) => b-a);
        

        var bar_data = [{
            x: sorted_values.slice(0,10).reverse(),
            y:ids.slice(0,10).map(id =>`OTU${id}`).reverse(),
            text: labels.slice(0,10).reverse(),
            type:"bar",
            orientation:"h"
        }];

        var bar_graph = {
            title: "Top 10 Microbial Species",
            margin:{t:120, l:80},
            height: 600,
            width: 800,
            
        }
        
        Plotly.newPlot("bar", bar_data, bar_graph);

        var BubbleGraph = {
            margin: { t: 0 },
            xaxis: { title: "ID" },
            yaxis: {title: "OTU(s)"},
            hovermode: "closest",
          };
      
            var Bubble_Data = [
            {
              x: ids,
              y: values,
              text: labels,
              mode: "markers",
              marker: {
                color: ids,
                size: values,
                }
            }
        ]; 

        Plotly.plot("bubble", Bubble_Data, BubbleGraph);
    });
};

function selection_box(){
    var selector = d3.select('#selDataset');

    d3.json("../data/samples.json").then((data) => {
        var name = data.names;
        name.forEach((option) => {
            selector.append("option").text(option).property("value",option);
        });

        const first_sample = name[0];
        builtCharts(first_sample);
        FetchData(first_sample);
    });
}


function optionChanged(newchoice) {
  // Fetch new data each time a new sample is selected
  builtCharts(newchoice);
  FetchData(newchoice);
}

selection_box();