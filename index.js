class resizeBreadcrumbs {
    constructor(selector, options = {}) {
        this.crumb = document.querySelector(selector);
        this.ol = this.crumb.querySelector('ol');
        this.li = this.ol.querySelectorAll('li');
        this.options = options;
        this.margin = this.getMargin(this.ol.querySelector('li'));
        this.divider = options.divider;
        this.crumbWidth = this.getCrumbsWidth();
        this.crumbItemArray = this.getCrumbItemArray();
        this.crumbItemsWidth = this.getCrumbItemsWidth();
        this.crumbItemsStartWidth = this.getCrumbItemsWidth();
        this.crumbItemsStartText = this.getCrumbStartText();
        this.arrLength = this.crumbItemArray.length;
        this.dataResize = [];
    }

    init() {
        this.prepare();
        this.resizeWindow();
    }

    prepare() {
        const windowWidth = window.innerWidth;
        let dataWidth = this.crumbItemsStartWidth;
        let i = 0;
        if (windowWidth > 499) {
            if (this.getCrumbsWidth() < this.crumbItemsWidth) {
                while(this.getCrumbsWidth() < this.crumbItemsWidth) {
                    let el = this.getMaxOfArray(this.crumbItemArray);
                    let index = this.crumbItemArray.indexOf(el);
                    this.changeCrumbText(index, windowWidth, this.divider);
                    this.dataResize[i].width = dataWidth + 75;
                    dataWidth = this.getCrumbItemsWidth();
                    i++;    
                }
            }
        }
    }

    resizeWindow() {
        window.addEventListener('resize', () => {
            const windowWidth = window.innerWidth;

            if (windowWidth > 499) {
                this.returnCrumbData(windowWidth);

                if (this.getCrumbsWidth() < this.crumbItemsWidth) {
    
                    let el = this.getMaxOfArray(this.crumbItemArray);
                    let index = this.crumbItemArray.indexOf(el);
    
                    this.changeCrumbText(index, windowWidth, this.divider);
    
                } 
    
                if ((this.getCrumbsWidth() > this.crumbItemsStartWidth) && (this.dataResize.length !== 0)) {
                    this.startPosition();
                }
            }
        })
    }

    returnCrumbData(width) {
        if (this.dataResize.length !== 0) {
            this.dataResize.forEach((data, index) => {
                if ((data.width + 10) >= width && (data.width < width)) {
                    this.changeCrumbText(data.index,'',data.text);
                    this.dataResize.splice(index, 1);
                }
            })
        }
    }

    changeCrumbText(index, windowWidth = '', text) {
        let crumbText = '';
        if ((index + 1) !== this.arrLength) {
            crumbText = this.li[index].querySelector('a').innerText;
            this.li[index].querySelector('a').innerHTML = text;
        } else {
            crumbText = this.li[index].innerText;
            this.li[index].innerHTML = text;
        }
        if (windowWidth !== '') {
            this.dataResize.push({
                width: windowWidth,
                index: index,
                text:  crumbText
            });
        }
        this.reloadWidth();
    }

    getCrumbsWidth() {
        return this.crumb.getBoundingClientRect().width;
    }

    getCrumbItemArray() {
        return [...this.li].map(li => li.getBoundingClientRect().width);
    }

    getCrumbStartText() {
        return [...this.li].map(li => li.innerText);
    }

    getCrumbItemsWidth() {
        return [...this.li].map(li => li.getBoundingClientRect().width).reduce((a, b) => a + b + this.margin);
    }

    getMargin(el) {
        return +window.getComputedStyle(el).marginRight.slice(0,-2);
    }

    reloadWidth() {
        this.crumbWidth = this.getCrumbsWidth();
        this.crumbItemArray = this.getCrumbItemArray();
        this.crumbItemsWidth = this.getCrumbItemsWidth();
    }

    getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray.slice(1));
    }

    startPosition() {
        this.li.forEach((li, index) => {
            if (li.querySelector('a')) {
                if (li.querySelector('a').innerText == this.divider) {
                    this.li[index].querySelector('a').innerText = this.crumbItemsStartText[index];
                }
            } else {
                if (li.innerText == this.divider) {
                    this.li[index].innerText = this.crumbItemsStartText[index];
                }
            }
        })
        this.reloadWidth();
        this.dataResize = [];
    }
}

if (document.querySelector('nav[aria-label="breadcrumb"]')) {
    const navBread = new resizeBreadcrumbs('nav[aria-label="breadcrumb"]', {'divider': '...'});
    navBread.init();
}