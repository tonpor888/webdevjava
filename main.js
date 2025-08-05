let userChartInstance = null;

async function fetchPosts() {
    const postList = document.getElementById('post-list');
    const chartContainer = document.getElementById('chart-container');
    postList.innerHTML = '<li>กำลังโหลดข้อมูล...</li>';
    chartContainer.style.display = 'none';

    try {
        // ดึงโพสต์ 20 รายการแรก
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=20');
        const posts = response.data;

        // แสดงโพสต์
        postList.innerHTML = '';
        posts.forEach(post => {
            const li = document.createElement('li');
            li.className = 'post-card';
            li.innerHTML = `
                <div class="post-title">${post.title}</div>
                <div class="post-user">User ID: ${post.userId}</div>
                <div class="post-body">${post.body.slice(0, 100)}...</div>
            `;
            postList.appendChild(li);
        });

        // สรุปจำนวนโพสต์ต่อ user
        const grouped = _.groupBy(posts, 'userId');
        const labels = Object.keys(grouped).map(id => `User ${id}`);
        const data = Object.values(grouped).map(arr => arr.length);

        // แสดงกราฟ
        chartContainer.style.display = 'block';
        if (userChartInstance) userChartInstance.destroy();
        const ctx = document.getElementById('userChart').getContext('2d');
        userChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'จำนวนโพสต์',
                    data: data,
                    backgroundColor: '#1976d2'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'จำนวนโพสต์ต่อ User (20 โพสต์แรก)'
                    }
                },
                scales: {
                    y: { beginAtZero: true, precision: 0 }
                }
            }
        });

    } catch (error) {
        postList.innerHTML = '<li>เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
        chartContainer.style.display = 'none';
    }
}