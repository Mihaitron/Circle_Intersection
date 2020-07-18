// Representation of a square in the QuadTree
class Square
{
  constructor(x, y, l)
  {
    this.x = x;
    this.y = y;
    this.l = l;
    
    this.neCorner = createVector(this.x + this.l / 2, this.y - this.l / 2);
    this.nwCorner = createVector(this.x - this.l / 2, this.y - this.l / 2);
    this.seCorner = createVector(this.x + this.l / 2, this.y + this.l / 2);
    this.swCorner = createVector(this.x - this.l / 2, this.y + this.l / 2);
  }
  
  getArea()
  {
    return this.l * this.l;
  }
}

// Representation of a circle outside the QuadTree
class Circle
{
  constructor(x, y, r)
  {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  
  getX()
  {
    return this.x;
  }
  
  getY()
  {
    return this.y;
  }
}

// Representation of the QuadTree
class QuadTree
{
  // Draw every line of the quadrant
  draw()
  {
    line(this.boundary.neCorner.x, this.boundary.neCorner.y, this.boundary.nwCorner.x, this.boundary.nwCorner.y);
    line(this.boundary.nwCorner.x, this.boundary.nwCorner.y, this.boundary.swCorner.x, this.boundary.swCorner.y);
    line(this.boundary.swCorner.x, this.boundary.swCorner.y, this.boundary.seCorner.x, this.boundary.seCorner.y);
    line(this.boundary.seCorner.x, this.boundary.seCorner.y, this.boundary.neCorner.x, this.boundary.neCorner.y);
  }
  
  constructor(boundary, maxDivisions, circles)
  {
    this.boundary = boundary;
    this.maxDiv = maxDivisions;
    this.circles = circles;
  }
  
  // Checks if a given corner is inside the a given circle
  isCornerInCircle(cornerX, cornerY, circleX, circleY)
  {
    let dx = abs(cornerX - circleX);
    let dy = abs(cornerY - circleY);
    
    if (dx + dy <= this.circles[0].r)
    {
      return true;
    }
    if (dx > this.circles[0].r)
    {
      return false;
    }
    if (dy > this.circles[0].r)
    {
      return false;
    }
    if (dx * dx + dy * dy <= this.circles[0].r * this.circles[0].r)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  
  // Checks if all the corners of the quadrant are inside a given circle
  hasAllCornersInsideCircle(circleX, circleY)
  { 
    return (this.isCornerInCircle(this.boundary.neCorner.x, this.boundary.neCorner.y, circleX, circleY) &&
            this.isCornerInCircle(this.boundary.nwCorner.x, this.boundary.nwCorner.y, circleX, circleY) &&
            this.isCornerInCircle(this.boundary.seCorner.x, this.boundary.seCorner.y, circleX, circleY) &&
            this.isCornerInCircle(this.boundary.swCorner.x, this.boundary.swCorner.y, circleX, circleY));
  }
  
  // Checks if the cornes of the quadrant are inside of at least one of the circles
  hasAllCornersInsideOneOfTheCircles()
  {
    for(let i = 1; i < this.circles.length; i++)
    {
      if (this.hasAllCornersInsideCircle(this.circles[i].x, this.circles[i].y))
      {
        return true;
      }
    }
    
    return false;
  }
  
  // Checks if at least one of the corners of the quadrant is indide the circle
  hasOneCornerInsideCircle(circleX, circleY)
  { 
    return (this.isCornerInCircle(this.boundary.neCorner.x, this.boundary.neCorner.y, circleX, circleY) ||
            this.isCornerInCircle(this.boundary.nwCorner.x, this.boundary.nwCorner.y, circleX, circleY) ||
            this.isCornerInCircle(this.boundary.seCorner.x, this.boundary.seCorner.y, circleX, circleY) ||
            this.isCornerInCircle(this.boundary.swCorner.x, this.boundary.swCorner.y, circleX, circleY));
  }
  
  // Checks if one of the corners of the quadrant is in at least one of the circles
  hasOneCornerInsideOneOfTheCircles()
  { 
    for(let i = 1; i < this.circles.length; i++)
    {
      if (this.hasOneCornerInsideCircle(this.circles[i].x, this.circles[i].y))
      {
        return true;
      }
    }
    
    return false;
  }
  
  // Create the actual subdivisions
  actuallySubdivide()
  {
    this.maxDiv--;
    
    // Get the x and y value of the boundary
    let x = this.boundary.x;
    let y = this.boundary.y;
    // Get the length of the boundary
    let l = this.boundary.l;
    
    // Create a square for each of the corners
    let neSquare = new Square(x + l / 4, y - l / 4, l / 2);
    let nwSquare = new Square(x - l / 4, y - l / 4, l / 2);
    let seSquare = new Square(x + l / 4, y + l / 4, l / 2);
    let swSquare = new Square(x - l / 4, y + l / 4, l / 2);
    
    // Create the subdivisions
    this.ne = new QuadTree(neSquare, this.maxDiv, this.circles);
    this.nw = new QuadTree(nwSquare, this.maxDiv, this.circles);
    this.se = new QuadTree(seSquare, this.maxDiv, this.circles);
    this.sw = new QuadTree(swSquare, this.maxDiv, this.circles);
    
    // Return the area of each subdivision summed up
    return this.ne.subdivide() +
           this.nw.subdivide() +
           this.se.subdivide() +
           this.sw.subdivide();
  }
  
  
  // Generally subdivide
  subdivide()
  {
    // If circle inscribed in square and can subdivide
    if (this.boundary.l == this.circles[0].r * 2 && this.maxDiv > 0)
    {
      return this.actuallySubdivide();
    }
    // Otherwise, if it can still divide
    else if (this.maxDiv > 0)
    {
      // If all the corners are inside the circle1
      if (this.hasAllCornersInsideCircle(this.circles[0].x, this.circles[0].y))
      {
        // If all the corners are inside the circle2
        if (this.hasAllCornersInsideOneOfTheCircles())
        {
          this.draw();
          return this.boundary.getArea();
        }
        // Otherwise, if one of the corners is inside the circle2
        else if (this.hasOneCornerInsideOneOfTheCircles())
        {
          return this.actuallySubdivide();
        }
        // Otherwise, if no corners are inside the circle 2
        else
        {
          return 0;
        }
      }
      // Otherwise, if one of the corners is inside the circle1
      else if (this.hasOneCornerInsideCircle(this.circles[0].x, this.circles[0].y))
      {
        // If all the corners are inside the circle2
        if (this.hasAllCornersInsideOneOfTheCircles())
        {
          return this.actuallySubdivide();
        }
        // Otherwise, if one of the corners is inside the circle2
        else if (this.hasOneCornerInsideOneOfTheCircles())
        {
          return this.actuallySubdivide();
        }
        // Otherwise, if no corners are inside the circle2
        else
        {
          return 0;
        }
      }
      // Otherwise, if no corners are inside the circle1
      else
      {
        return 0;
      }
    }
    // Otherwise, if it cannot subdivide
    else
    {
      // If all corners are inside the circle1
      if (this.hasAllCornersInsideCircle(this.circles[0].x, this.circles[0].y))
      {
        // If all corners are inside the circle2
        if (this.hasAllCornersInsideOneOfTheCircles())
        {
          this.draw();
          return this.boundary.getArea();
        }
        // Otherwise, if one corner is inside the circle 2
        else if (this.hasOneCornerInsideOneOfTheCircles())
        {
          this.draw();
          return this.boundary.getArea() / 2;
        }
        // Otherwise, if no corners in the circle 2
        else
        {
          return 0;
        }
      }
      // Otherwise, if only one corner inside the circle1
      else if (this.hasOneCornerInsideCircle(this.circles[0].x, this.circles[0].y))
      {
        // If all corners are inside the circle2
        if (this.hasAllCornersInsideOneOfTheCircles())
        {
          this.draw();
          return this.boundary.getArea() / 2;
        }
        // Otherwise, if one corner is inside the circle2
        else if (this.hasOneCornerInsideOneOfTheCircles())
        {
          this.draw();
          return this.boundary.getArea() / 2;
        }
        // Otherwise, if no corners inside the circle2
        else
        {
          return 0;
        }
      }
      // Otherwise, if no corners are inside the circle1
      else
      {
        return 0;
      }
    }
  }
}
