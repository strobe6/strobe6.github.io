(function(){
                window.PLOTLYENV={'BASE_URL': 'https://plot.ly'};

                var myPlot = document.getElementById('plot-div')
                var hoverInfo = document.getElementById('hover-image');
                var blankImg = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                var modal = document.getElementById('myModal');
                var modalImg = document.getElementById("img01");
                var captionText = document.getElementById("caption");
                var span = document.getElementsByClassName("close")[0];
                span.onclick = function() { 
                  modal.style.display = "none";
                }

                var resizeDebounce = null;
                var bb = myPlot.getBoundingClientRect();
                var screenHeight = bb.height;
                var screenWidth = bb.width;
                var maxHeight = screenHeight/1.8;
                var maxWidth = screenWidth/2.5;
                hoverInfo.style.maxHeight = maxHeight + "px";
                hoverInfo.style.maxWidth = maxWidth + "px";

                function resizePlot() {
                    Plotly.relayout(myPlot, {
                        width: bb.width,
                        height: bb.height
                    });
                }
                
                window.addEventListener('resize', function() {
                    if (resizeDebounce) {
                        window.clearTimeout(resizeDebounce);
                    }
                    resizeDebounce = window.setTimeout(resizePlot, 100);
                });
                
                Plotly.plot(myPlot,  {
                    data: figure.data,
                    layout: figure.layout,
                    frames: figure.frames,
                    config: {"mapboxAccessToken": "pk.eyJ1IjoiY2hyaWRkeXAiLCJhIjoiY2lxMnVvdm5iMDA4dnhsbTQ5aHJzcGs0MyJ9.X9o_rzNLNesDxdra4neC_A", "linkText": "Export to plot.ly", "showLink": true}
                });

                myPlot.on('plotly_hover', function(data){
                    var x = data.points[0].x,
                        y = data.points[0].y;

                    var xaxis = data.points[0].xaxis,
                        yaxis = data.points[0].yaxis;

                    var imgSrc = blankImg;

                    var point = x + "," + y;
                    if(images[point] !== undefined) imgSrc = images[point];

                    hoverInfo.src = imgSrc;
                    var infotext = data.points.map(function(d){
                        var xpixel = xaxis.l2p(d.x),
                            ypixel = yaxis.l2p(d.y);
                        console.log("pixel: " + xpixel + ", " + ypixel);
                        console.log("Screen: " + screenWidth + ", " + screenHeight);
                        // if (ypixel > ( screenHeight/2)  ) {
                        //     hoverInfo.style.bottom = 0;
                        //     hoverInfo.style.top = (screenHeight - ypixel) + "px";
                        // } else {
                        //     hoverInfo.style.bottom = 0;
                        //     hoverInfo.style.top = ypixel + "px";
                        // }
                        hoverInfo.style.top = screenHeight/4 + "px";
                        if (xpixel > ( screenWidth/2) + 10){
                            // hoverInfo.style.left = xpixel - (screenWidth - xpixel) - 100  + "px";
                            hoverInfo.style.left = xpixel - 700 + "px";
                            hoverInfo.style.right = 0;
                        } else {
                            hoverInfo.style.right = 0;
                            hoverInfo.style.left = xpixel + 100 + "px"; 
                        }  
                        
                    });      
                                          
                }).on('plotly_unhover', function(data){
                    var original = hoverInfo.src;
                    setTimeout(function() {
                        if(hoverInfo.src == original){
                            hoverInfo.src = '';
                        }
                    }, 750);
                    
                });

                myPlot.on('plotly_click', function(data){
                    hoverInfo.src = '';
                    var x = data.points[0].x,
                        y = data.points[0].y;
                    var point = x + "," + y;
                    if(images[point] !== undefined) imgSrc = images[point];
                    modal.style.display = "block";
                    modalImg.src = imgSrc;
                    captionText.innerHTML = "Drop Collision at Drop Size: " + x + "ms and Strobe Delay: " + y +"ms";
                });
                
           }());