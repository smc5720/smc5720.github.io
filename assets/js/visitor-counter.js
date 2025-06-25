// 방문자 수 카운터 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // GoatCounter API를 사용하여 방문자 수 가져오기
    async function fetchVisitorStats() {
        try {
            // GoatCounter API 엔드포인트 (Authorization 헤더 추가)
            const response = await fetch('https://smc5720.goatcounter.com/api/v0/stats/total', {
                headers: {
                    'Authorization': 'Bearer 17fv4xim8svnd1d9syb98k88c6czsi0h5igf7d1ltywpkymt5j2'
                }
            });
            const data = await response.json();
            
            // 총 방문자 수 업데이트 (About 페이지 + 사이드바)
            const totalVisitors = document.getElementById('total-visitors');
            const sidebarTotalVisitors = document.getElementById('sidebar-total-visitors');
            
            if (totalVisitors && data.total) {
                totalVisitors.textContent = data.total.toLocaleString();
            }
            if (sidebarTotalVisitors && data.total) {
                sidebarTotalVisitors.textContent = data.total.toLocaleString();
            }
            
            // 오늘 날짜와 7일 전 날짜 계산 (한국 시간 기준 00:00:00으로 설정)
            const todayDate = new Date();
            // 한국 시간대(KST, UTC+9) 기준으로 자정 설정
            const kstOffset = 9 * 60; // 한국 시간대 오프셋 (분)
            
            // 한국 시간 기준으로 자정 설정
            todayDate.setUTCHours(0, 0, 0, 0); // UTC 기준 자정으로 설정
            todayDate.setUTCMinutes(todayDate.getUTCMinutes() + kstOffset); // 한국 시간으로 조정
            
            const startDate = new Date(todayDate.getTime() - 6 * 24 * 60 * 60 * 1000);
            startDate.setUTCHours(0, 0, 0, 0); // UTC 기준 자정으로 설정
            startDate.setUTCMinutes(startDate.getUTCMinutes() + kstOffset); // 한국 시간으로 조정
            
            const start = startDate.toISOString(); // ISO 8601 형식
            const end = todayDate.toISOString();   // ISO 8601 형식

            // 공식 엔드포인트로 일별 방문자 수 가져오기
            const todayResponse = await fetch(`https://smc5720.goatcounter.com/api/v0/stats/hits?start=${start}&end=${end}`, {
                headers: {
                    'Authorization': 'Bearer 17fv4xim8svnd1d9syb98k88c6czsi0h5igf7d1ltywpkymt5j2'
                }
            });
            const todayData = await todayResponse.json();
            
            const todayVisitors = document.getElementById('today-visitors');
            const sidebarTodayVisitors = document.getElementById('sidebar-today-visitors');
            const weekVisitors = document.getElementById('week-visitors');
            const sidebarWeekVisitors = document.getElementById('sidebar-week-visitors');
            
            if (todayData.hits) {
                const todayStr = new Date().toISOString().split('T')[0];
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 6);
                const weekStartStr = weekAgo.toISOString().split('T')[0];

                let todayCount = 0;
                let weekCount = 0;

                todayData.hits.forEach(hit => {
                    if (hit.stats) {
                        hit.stats.forEach(stat => {
                            if (stat.day === todayStr) {
                                todayCount += stat.daily;
                            }
                            if (stat.day >= weekStartStr && stat.day <= todayStr) {
                                weekCount += stat.daily;
                            }
                        });
                    }
                });

                if (todayVisitors) todayVisitors.textContent = todayCount.toLocaleString();
                if (sidebarTodayVisitors) sidebarTodayVisitors.textContent = todayCount.toLocaleString();
                if (weekVisitors) weekVisitors.textContent = weekCount.toLocaleString();
                if (sidebarWeekVisitors) sidebarWeekVisitors.textContent = weekCount.toLocaleString();
            }
            
        } catch (error) {
            console.log('방문자 통계를 가져오는 중 오류가 발생했습니다:', error);
            
            // 오류 시 기본값 표시 (About 페이지 + 사이드바)
            const elements = [
                'total-visitors', 'today-visitors', 'week-visitors',
                'sidebar-total-visitors', 'sidebar-today-visitors', 'sidebar-week-visitors'
            ];
            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = 'N/A';
                }
            });
        }
    }
    
    // 페이지 로드 시 방문자 통계 가져오기
    fetchVisitorStats();
    
    // 5분마다 방문자 통계 업데이트
    setInterval(fetchVisitorStats, 5 * 60 * 1000);
});

// 간단한 방문자 카운터 (로컬 스토리지 기반 - 백업용)
function updateLocalVisitorCount() {
    const today = new Date().toDateString();
    const visitorKey = `visitor_${today}`;
    
    // 오늘 방문자 수 증가
    let todayCount = localStorage.getItem(visitorKey) || 0;
    todayCount = parseInt(todayCount) + 1;
    localStorage.setItem(visitorKey, todayCount);
    
    // 총 방문자 수 증가
    let totalCount = localStorage.getItem('total_visitors') || 0;
    totalCount = parseInt(totalCount) + 1;
    localStorage.setItem('total_visitors', totalCount);
    
    // GoatCounter API가 실패할 경우를 대비한 백업 (About 페이지 + 사이드바)
    const elements = [
        { id: 'today-visitors', value: todayCount },
        { id: 'total-visitors', value: totalCount },
        { id: 'sidebar-today-visitors', value: todayCount },
        { id: 'sidebar-total-visitors', value: totalCount }
    ];
    
    elements.forEach(item => {
        const element = document.getElementById(item.id);
        if (element && element.textContent === 'N/A') {
            element.textContent = item.value.toLocaleString();
        }
    });
}

// 페이지 로드 시 로컬 방문자 카운터 업데이트
document.addEventListener('DOMContentLoaded', function() {
    updateLocalVisitorCount();
}); 