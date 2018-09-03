(function(){
    // 点赞/取消点赞
    // 当前是否点赞
    // 查询点赞总次数
    // 其他
    // 一种点赞是较常规的，即用户可以对其中的某一条信息、或者评论等进行点赞、取消点赞的操作。
    // 另一种点赞则是用户可以在一天中对任意的用户点赞，点赞后一天，第二天解除点赞限制，可以重新对同一用户进行点赞，也就是说点赞是可以累加的；
     let PraiseButton = function() {
        this.num = 520;
        this.type = 'default';
        this.likeState = false;
        this.canLike = true;
    }
    PraiseButton.prototype = {
        likeSure(num) { // 点赞
            if(this.canLike) {
                this.canLike = false;
                this.num += num;
                this.likeState = true; 
            }      
        },
        likeCancle(num) { // 取消点赞;
            this.num -= num;
            this.likeState = false; 
            this.canLike = true;
        },
        isLike(state) { // 当前是否点赞
            if(state) {
                this.likeState = true;  
            }else{
                this.likeState = false;
            }
        },
        changeCanLike() { // 点赞限制
            this.canLike = true;
        },
        getLikeNum() { // 查询点赞总次数
            return this.num;
        }

    }

    let Thumb = new PraiseButton();
    Thumb.type = 'Thumb';
    console.log(Thumb.getLikeNum())
}())