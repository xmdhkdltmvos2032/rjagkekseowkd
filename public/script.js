document.addEventListener("DOMContentLoaded", () => {
    const genreSelect = document.getElementById("genreSelect");
    const ctx = document.getElementById("moviesChart").getContext("2d");
    let chart;
    let movieData = []; // 원본 영화 데이터 배열

    genreSelect.addEventListener("change", async () => {
        const genreId = genreSelect.value;
        const response = await fetch(`/movies?genreId=${genreId}`);
        const movies = await response.json();

        // 영화 데이터 배열에 영화 ID와 제목 저장
        movieData = movies.map(movie => ({
            title: movie.title,
            id: movie.id, // TMDB 영화 ID
            vote_average: movie.vote_average
        }));

        // 평점 기준으로 영화 정렬 (높은 순으로)
        const sortedMovies = [...movieData].sort((a, b) => b.vote_average - a.vote_average);

        // 정렬된 영화 제목과 평점 데이터 가져오기
        const movieTitles = sortedMovies.map(movie => movie.title);
        const movieRatings = sortedMovies.map(movie => movie.vote_average);

        if (chart) chart.destroy(); // 기존 차트 삭제

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: movieTitles.slice(0, 7), // 상위 7개 영화 제목
                datasets: [{
                    label: '영화 평점',
                    data: movieRatings.slice(0, 7), // 상위 7개 영화 평점
                    backgroundColor: 'rgba(20, 13, 232, 0.59)', // 배경 색상
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false, // 범례를 숨김
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return '평점: ' + tooltipItem.raw; // 툴팁에 평점만 표시
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: false // X축 제목 숨기기
                        },
                        ticks: {
                            font: {
                                size: 12, // 레이블 폰트 크기 조정
                            }
                        },
                        grid: {
                            display: false // X축의 그리드선 숨기기
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '평점' // Y축 제목 표시
                        },
                        ticks: {
                            beginAtZero: true, // y축 시작점 0으로 설정
                            max: 10, // 최대값 10으로 설정
                            stepSize: 1 // y축 간격 설정
                        }
                    }
                },
                // 클릭 이벤트 처리
                onClick: function(evt, activeElements) {
                    if (activeElements.length > 0) {
                        // 클릭된 영화 데이터 가져오기
                        const clickedIndex = activeElements[0].index;
                        const clickedMovie = sortedMovies[clickedIndex]; // 정렬된 배열에서 영화 찾기

                        // TMDB 링크로 이동하도록 설정 (다른 사이트로 이동하지 않도록 강제)
                        const tmdbLink = `https://www.themoviedb.org/movie/${clickedMovie.id}`;
                        window.open(tmdbLink, "_blank");
                    }
                }
            }
        });
    });
});
