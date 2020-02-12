function player()
{
    this.w = 15;
    this.h = 80;
    
    this.pos = createVector(this.w * 2, height/2 - this.h/2);
    this.acc - createVector(0,0);
    this.spd = 10;
    this.maxSpd = 10; 
    
    this.show = function()
    {
        noStroke();
        fill(255);
        rect(this.pos.x,this.pos.y, this.w, this.h);
    }
    
 

}

