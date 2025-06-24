// 방문자 수 카운터 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // GoatCounter API를 사용하여 방문자 수 가져오기
    async function fetchVisitorStats() {
        try {
            // GoatCounter API 엔드포인트
            const response = await fetch('https://smc5720.goatcounter.com/api/v0/stats/total');
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
            
            // 오늘 방문자 수 가져오기
            const todayResponse = await fetch('https://smc5720.goatcounter.com/api/v0/stats/daily?start=2024-01-01&end=2024-12-31');
            const todayData = await todayResponse.json();
            
            const todayVisitors = document.getElementById('today-visitors');
            const sidebarTodayVisitors = document.getElementById('sidebar-today-visitors');
            
            if (todayData.days && todayData.days.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                const todayStats = todayData.days.find(day => day.date === today);
                const todayCount = todayStats ? todayStats.count : 0;
                
                if (todayVisitors) {
                    todayVisitors.textContent = todayCount.toLocaleString();
                }
                if (sidebarTodayVisitors) {
                    sidebarTodayVisitors.textContent = todayCount.toLocaleString();
                }
            }
            
            // 이번 주 방문자 수 계산
            const weekVisitors = document.getElementById('week-visitors');
            const sidebarWeekVisitors = document.getElementById('sidebar-week-visitors');
            
            if (todayData.days) {
                const today = new Date();
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const weekStart = weekAgo.toISOString().split('T')[0];
                
                const weekCount = todayData.days
                    .filter(day => day.date >= weekStart)
                    .reduce((sum, day) => sum + day.count, 0);
                
                if (weekVisitors) {
                    weekVisitors.textContent = weekCount.toLocaleString();
                }
                if (sidebarWeekVisitors) {
                    sidebarWeekVisitors.textContent = weekCount.toLocaleString();
                }
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