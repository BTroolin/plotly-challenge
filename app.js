// get data and create plots
function get_Plot(id) {
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Frequency: ${wfreq}`)

        var samples = data.samples.filters(s => s.id.toString() === id)[0];
        console.log(samples)

        var sampleValues = samples.sample_values.slice(0, 10).reverse();

        var idValues = (samples.otu_ids.slice(0,10)).reverse();

        var idOtu = idValues.map(d => "OTU" + d)
        console.log(`OTU IDS: ${idOtu}`)

        //get top 10 labels
        var labels = samples.otu_labels.slice(0,10);
        // make trace for bar plot
        var trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            type: "bar",
            orientation: "h"

        };

        var data = [trace];

        var layout = {
            title: "Top Ten OTU",
            yaxis:{tickmode:"linear"},
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };
        // create bar plot
        Plotly.newPlot("bar", data, layout);

        //trace for bubble chart
        var traceb = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,    
            },
            text: samples.otu_labels
        };

        // bubble plot layout
        var layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1200
        };

        var datab = [traceb]

        Plotly.newPlot("bubble", datab, layout);


        // create a pie chart
        var pietrace = {
            labels: idOtu,
            values: sampleValues,
            type:"pie"
        };

        var piedata = [pietrace]

        Plotly.newPlot("gauge", piedata)

    });
}

// function to get the sample data
function Getdata(id) {
    d3.json("data/samples.json").then((data)=> {
         var metadata = data.metadata;
         //console.log(metadata)

         var result = metadata.filter(meta => meta.id.toString() === id)[0];

         var demoinfo = d3.select("#sample-metadata");

         demoinfo.html("");

         Object.entries(result).forEach((key) => {
             demoinfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
         });
    });
}

// function for option changes
function option_change(id) {
    get_Plot(id);
    Getdata(id);
};

function init() {
    var dropdown = d3.select("#selDataset");

    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        get_Plot(data.names[0]);
        Getdata(data.names[0]);
    });
}
init();