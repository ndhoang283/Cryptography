$('#paging').pagination({
    dataSource: '/api/account?page=1',
    locator: 'data',
    totalNumberLocator: function(response){
        return response.total;
    },
    pageSize: 5,
    afterPageOnClick: function(event, pageNumber){
        loadPage(pageNumber)
    },
    afterPreviousOnClick: function(event,pageNumber){
        loadPage(pageNumber);
    },
    afterNextOnClick: function(event, pageNumber){
        loadPage(pageNumber);
    }
})

function loadPage(page){
    $('#content').html('')
    $.ajax({
        url: '/api/account?page='+page
    })
    .then(rs=>{
        console.log(rs.tongSoPage);
        for(let i=0; i<rs.data.length;i++){
            const element = rs.data[i];
            var item = $(`<h3>${element.username}</h3>`)
            $('#content').append(item)
        }
    })
    .catch(err=>{
        console.log(err);
    })
}
loadPage(1)