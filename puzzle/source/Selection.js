/**
 * Selection Manager
 */
class Selection {

    /**
     * The Selection constructor
     */
    constructor() {
        this.storage = new Storage("puzzle");
        this.element = document.querySelector(".selection");
        this.list    = document.querySelector(".slider-list");
        this.desc    = document.querySelector(".selection-desc");
        this.button  = document.querySelector(".selection button");

        this.index   = 0;
        this.amount  = 2;
        this.total   = 10;
        this.last    = this.total - this.amount + 1;

        this.build();
    }

    /**
     * Builds the Slider
     * @returns {Void}
     */
    build() {
        const pieces = [ "50", "100", "250", "500" ];

        this.list.innerHTML = "";
        for (let i = 1; i <= this.total; i += 1) {
            let completed = 0;
            let selects   = "";
            for (const pieceCount of pieces) {
                const score  = this.storage.get(`art${i}.${pieceCount}.score`);
                const isDone = score && score.placed === score.total
                completed += isDone ? 1 : 0;
                selects   += `<li data-action="select" ${isDone ? "class='completed'" : ""}>${pieceCount}</li>`;
            }

            const li     = document.createElement("li");
            li.className = "slider-slide";
            li.innerHTML = `
                <div class="slider-image">
                    <h3>${i}</h3>
                    <img src="images/art${i}.jpg" />
                    ${completed > 0 ? `<h4 ${(completed === pieces.length) ? "class='done'" : ""}>
                        ${completed}/${pieces.length}
                    </h4>` : ""}
                </div>
                <ul data-image="art${i}">${selects}</ul>
            `;
            this.list.appendChild(li);
        }

        this.list.style.setProperty("--slider-count", this.amount);
        this.list.style.setProperty("--slider-total", this.total);
    }

    /**
     * Shows the Selection
     * @returns {Void}
     */
    show() {
        this.element.style.display = "block";
    }

    /**
     * Moves the Slider one to the left or right
     * @param {Number} dir
     * @returns {Void}
     */
    moveSlider(dir) {
        this.index += dir;
        if (this.index < 0) {
            this.index = this.last - 1;
        } else if (this.index > this.last - 1) {
            this.index = 0;
        }

        this.list.style.transform = `translateX(calc(-100%/${this.total}*${this.index}))`;
    }

    /**
     * Selects the Pieces
     * @param {DOMElement} element
     * @returns {Void}
     */
    select(element) {
        this.image  = element.parentNode.getAttribute("data-image");
        this.pieces = Number(element.innerHTML);

        if (this.selElement) {
            this.selElement.classList.remove("selected");
            this.selElement.parentNode.parentNode.classList.remove("selected");
        }
        this.selElement = element;
        this.selElement.classList.add("selected");
        this.selElement.parentNode.parentNode.classList.add("selected");

        this.button.style.display = "block";
        const score = this.storage.get(`${this.image}.${this.pieces}.score`);
        if (score) {
            const percent = Math.floor(score.placed * 100 / score.total);
            const time    = this.storage.get(`${this.image}.${this.pieces}.time`);
            let   desc    = `Completed <b>${percent}%</b> of this puzzle.`;
            if (time) {
                const timeParts = Utils.parseTime(time);
                desc = `Completed <b>${percent}%</b> of this puzzle in <b>${timeParts.join(":")}</b>.`;
            }
            this.desc.innerHTML     = desc;
            this.desc.style.display = "block";
            this.button.innerHTML   = percent === 100 ? "Restart" : "Continue";
        } else {
            this.desc.style.display = "none";
            this.button.innerHTML   = "Start";
        }
    }

    /**
     * Starts the Puzzle
     * @returns {Void}
     */
    start() {
        this.selElement.classList.remove("selected");
        this.selElement.parentNode.parentNode.classList.remove("selected");

        this.element.style.display = "none";
        this.desc.style.display    = "none";
        this.button.style.display  = "none";

        this.onStart(this.image, this.pieces);
    }
}
