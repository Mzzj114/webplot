const { Graph } = G6;

default_graph_data = {
    nodes: [{
        id: 'demo-node-1',
        style: {
            x: 250,
            y: 250,
        }
    },
    {
        id: 'demo-node-2',
        style: {
            x: 350,
            y: 250
        }
    },
    ],
    edges: [{
        source: 'demo-node-1',
        target: 'demo-node-2'
    }],
};

const graph = new Graph({
    container: 'ID-graph-container',
    data: default_graph_data,
    node: {
        type: 'html',
        style: {
            size: [100, 50],
            innerHTML: '<p>Node</p>',
        },
    },
    edge: {
        type: "quadratic",
    },
    behaviors: [{
        type: 'zoom-canvas',
        sensitivity: 2,
    }, {
        type: 'drag-canvas',
    }, {
        key: 'drag-element',
        type: 'drag-element',
        enable: true,
    }, {
        key: 'create-edge',
        type: 'create-edge',
        enable: false,
    }],

});

graph.render();