document.addEventListener("DOMContentLoaded", () => {
    const genreSelect = document.getElementById("genreSelect");
    const ctx = document.getElementById("moviesChart").getContext("2d");
    let chart;
    let movieData = []; 

    genreSelect.addEventListener("change", async () => {
        const genreId = genreSelect.value;
        const response = await fetch(`/movies?genreId=${genreId}`);
        const movies = await response.json();

        movieData = movies.map(movie => ({
            title: movie.title,
            id: movie.id, // TMDB 영화 ID
            vote_average: movie.vote_average
        }));

        
        const sortedMovies = [...movieData].sort((a, b) => b.vote_average - a.vote_average);

       
        const movieTitles = sortedMovies.map(movie => movie.title);
        const movieRatings = sortedMovies.map(movie => movie.vote_average);

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: movieTitles.slice(0, 7), 
                datasets: [{
                    label: '영화 평점',
                    data: movieRatings.slice(0, 7), 
                    backgroundColor: 'rgba(20, 13, 232, 0.59)', 
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false, 
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return '평점: ' + tooltipItem.raw; 
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: false 
                        },
                        ticks: {
                            font: {
                                size: 12, 
                            }
                        },
                        grid: {
                            display: false 
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '평점' 
                        },
                        ticks: {
                            beginAtZero: true, // 
                            max: 10, 
                            stepSize: 1 
                        }
                    }
                },
                
                onClick: function(evt, activeElements) {
                    if (activeElements.length > 0) {
                        
                        const clickedIndex = activeElements[0].index;
                        const clickedMovie = sortedMovies[clickedIndex]; 

                        
                        const tmdbLink = `https://www.themoviedb.org/movie/${clickedMovie.id}`;
                        window.open(tmdbLink, "_blank");
                    }
                }
            }
        });
    });
});
