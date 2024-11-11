const { Graph } = G6;

// 默认数据
default_graph_data = {
    nodes: [{
        id: 'demo-node-1',
        style: {
            x: 250,
            y: 250,
            innerHTML: '<div style="border: 1px solid #ddd; padding: 32px; background-color: #f9f9f9;">node 1</div>',
        }
    },
    {
        id: 'demo-node-2',
        style: {
            x: 350,
            y: 250,
            innerHTML: '<div style="border: 1px solid #ddd; padding: 32px; background-color: #f9f9f9;">node 2</div>',
        }
    },
    ],
    edges: [{
        source: 'demo-node-1',
        target: 'demo-node-2'
    }],
};

// 初始化数据
let content = default_graph_data;
const graph = new Graph({
    container: 'ID-graph-container',
    data: content,
    node: {
        type: 'html',
        style: {
            size: [100, 50],
        },
    },
    edge: {
        type: "quadratic",
    },
    behaviors: [{
        key: 'zoom-canvas',
        type: 'zoom-canvas',
        sensitivity: 2,
        enable: false,
    }, {
        key: 'drag-canvas',
        type: 'drag-canvas',
        enable: false,
    }, {
        key: 'drag-element',
        type: 'drag-element',
        enable: (event) => event.shiftKey === false,
    }, {
        key: 'create-edge',
        type: 'create-edge',
        enable: (event) => event.shiftKey === true,
    }],
    plugins: [
        {
            type: 'tooltip',
            trigger: "click",
            getContent: (e, itemsss) => {
              let result = `<h4>Custom Content</h4>`;
              itemsss.forEach((item) => {
                result += `<p>Type: ${item.id}</p>`;
                alert(item.id);
              });
              return `正在编辑`;
            },
          },
      ],
});

function set_file_content(content) {
    // graph the json content
    graph.setData(content);
    graph.render();
}


graph.render();