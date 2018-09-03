class PraiseButton {
    constructor(num, ele) {
        this.num = num;
        this.ele = ele;
    }
    likeButton() {
        this.ele.click(()=> {
            if(this.num<10) {
                this.num = addNum(this.num);
                this.ele.children('.likeNum').html(this.num);
                this.ele.children('.likeIcon').attr('src','../img/like.png');
            }else {
                this.num = 0;
                this.ele.children('.likeNum').html(this.num);
                this.ele.children('.likeIcon').attr('src','../img/unlike.png');
            }   
            console.log(this.num)       
        })
    }
}

class Thumb extends PraiseButton {
    constructor(num, ele) {
        super(num, ele)
    }
}

export default Thumb;