import React, { Component } from 'react';
import '../../styles/cursor.scss';
import { withRouter } from 'react-router-dom';

class Cursor extends Component {
  constructor() {
    super();
  }

  componentDidMount() {

    let prev = "";
    let curr = "";

    setInterval(() => {
      curr = this.props.history.location.pathname;
      if (prev !== curr) {
        cursor.setupEventListeners();
      }
      prev = curr;
    }, 100);

    var cursor = {
      delay: 8,
      _x: 0,
      _y: 0,
      endX: (window.innerWidth / 2),
      endY: (window.innerHeight / 2),
      cursorVisible: true,
      cursorEnlarged: false,
      $dot: document.querySelector('.cursor-dot'),
      $outline: document.querySelector('.cursor-dot-outline'),

      init: function () {
        // Set up element sizes
        this.dotSize = this.$dot.offsetWidth;
        this.outlineSize = this.$outline.offsetWidth;

        this.setupEventListeners();
        this.animateDotOutline();
      },

      targetAnchorAndSpan: (self) => {
        let AnchorAndSpan = document.querySelectorAll('a, span')
        AnchorAndSpan.forEach(function (el) {
          el.addEventListener('mouseover', function () {
            self.cursorEnlarged = true;
            self.toggleCursorSize();
          });
          el.addEventListener('mouseout', function () {
            self.cursorEnlarged = false;
            self.toggleCursorSize();
          });
        });
      },

      setupEventListeners: function () {
        var self = this;

        // Anchor hovering
        this.targetAnchorAndSpan(self);

        // Click events
        document.addEventListener('mousedown', function () {
          self.cursorEnlarged = true;
          self.toggleCursorSize();
        });
        document.addEventListener('mouseup', function () {
          self.cursorEnlarged = false;
          self.toggleCursorSize();
        });

        document.addEventListener('mousemove', function (e) {
          // Show the cursor
          self.cursorVisible = true;
          self.toggleCursorVisibility();
          // console.log(e)

          // Position the dot
          self.endX = e.clientX;
          self.endY = e.clientY;
          self.$dot.style.top = self.endY + 'px';
          self.$dot.style.left = self.endX + 'px';
        });

        // Hide/show cursor
        document.addEventListener('mouseenter', function (e) {
          self.cursorVisible = true;
          self.toggleCursorVisibility();
          self.$dot.style.opacity = 1;
          self.$outline.style.opacity = 1;
        });

        document.addEventListener('mouseleave', function (e) {
          self.cursorVisible = true;
          self.toggleCursorVisibility();
          self.$dot.style.opacity = 0;
          self.$outline.style.opacity = 0;
        });
      },

      animateDotOutline: function () {
        var self = this;

        self._x += (self.endX - self._x) / self.delay;
        self._y += (self.endY - self._y) / self.delay;
        self.$outline.style.top = self._y + 'px';
        self.$outline.style.left = self._x + 'px';

        requestAnimationFrame(this.animateDotOutline.bind(self));
      },

      toggleCursorSize: function () {
        var self = this;

        if (self.cursorEnlarged) {
          self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
          self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
          self.$outline.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        } else {
          self.$outline.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
          self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
          self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      },

      toggleCursorVisibility: function () {
        var self = this;

        if (self.cursorVisible) {
          self.$dot.style.opacity = 1;
          self.$outline.style.opacity = 1;
        } else {
          self.$dot.style.opacity = 0;
          self.$outline.style.opacity = 0;
        }
      }
    }

    cursor.init();
  }
  render() {
    return (
      <>
        <div className="cursor-dot-outline"></div>
        <div className="cursor-dot"></div>
      </>
    )
  }
}

export default withRouter(Cursor);