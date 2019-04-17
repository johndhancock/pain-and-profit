import * as d3 from 'd3';
import $ from 'jquery';

import { getWidth, responsiveRender } from './utils';


window.addEventListener('touchstart', function onFirstTouch() {
  document.body.classList.add('touch-device');
  window.removeEventListener('touchstart', onFirstTouch, false);
}, false);


const HHSC = 'Texas Health and Human Services Commission';
const UNITED = 'United Healthcare';

const data = {
  nodes: [
    // Gov. Abbott's office
    { id: 'Gov. Greg Abbott', group: 'Lawmakers', img: 'g_abbott', size: 1.5, desc: 'Despite his public calls for ending the revolving door, Abbott has kept the tradition alive. His longtime chief of staff left last year and now lobbies for Aetna. Abbott replaced him with lobbyist Luis Saenz, whose clients included United Healthcare. Two other directors in Abbott’s office have close ties to health care companies.' },
    { id: 'Luis Saenz', group: 'Lawmakers', img: 'l_saenz', desc: 'When Gov. Greg Abbott tapped him to be chief of staff, Saenz was a registered lobbyist for United Healthcare, a client of his since 2009. He was a former top adviser to Gov. Rick Perry and helped run his 2002 and 2006 campaigns for governor.' },
    // Gov. Perry
    { id: 'Former Gov. Rick Perry', group: 'Lawmakers', img: 'r_perry', size: 1.5, desc: 'MCNA Dental was a major donor to former Gov. Rick Perry during his unsuccessful runs for the White House. Perry joined MCNA’s board when he left office, and he lobbied for the company to get a big contract in Florida.' },
    // Texas Association of Health Plans
    { id: 'Jason Baxter', group: 'Lobbyists', img: 'j_baxter', desc: 'For 10 years he was a top aide to state Sen. Tommy Williams, who was installed by Abbott in May to run the health commission. Baxter is now the director of government relations for the Texas Association of Health Plans.' },
    // MCOs
    { id: 'MCNA Dental', anchor: 'e', org: true, group: 'MCOs', img: 'mcnalogo', size: 1.4 },
    { id: UNITED, anchor: 'w', org: true, group: 'MCOs', img: 'unitedlogo', size: 1.4 },
    { id: 'Texas Association of Health Plans', org: true, group: 'MCOs', img: 'tahplogo', size: 1.25, height: 0.3, anchor: 's' },
    { id: 'Centene Corp.', org: true, height: 0.2, anchor: 's', group: 'MCOs', img: 'centenelogo', size: 1.4 },
    { id: 'Cigna', org: true, group: 'MCOs', img: 'cignalogo', size: 1.05, height: 1, anchor: 's' },
    { id: 'Amerigroup', org: true, group: 'MCOs', img: 'amglogo', size: 1.6, height: 0.2, anchor: 's' },
    { id: 'Aetna', org: true, group: 'MCOs', img: 'aetnalogo', size: 1.2, height: 0.3, anchor: 's' },
    // HHSC
    { id: HHSC, org: true, height: 0.35, anchor: 'n', group: 'Texas Health and Human Services Commission', img: 'hhsclogo', size: 2.35 },
    { id: 'Victoria Ford', group: HHSC, img: 'v_ford', desc: 'A former senior adviser to Gov. Rick Perry on health issues, she lobbied for two insurers and the Texas Association of Health Plans. In November, she joined the health commission as its first chief policy officer, 11 days after she told the state she was no longer lobbying for United Healthcare.' },
    { id: 'Tommy Williams', group: HHSC, desc: 'Former state senator and advocate for managed care who accepted $59,000 in campaign contributions from health care companies during his decade in the Senate. Abbott hired him as chief of staff in 2017 and installed him to oversee the health commission in May.', img: 't_williams' },
    // Lobbyists
    { id: 'Mike Toomey', group: 'Lobbyists', img: 'm_toomey', desc: 'A former state House member, roommate and chief of staff to Gov. Rick Perry.  Since 2001 he has reported lobbying income totaling more than $1 million from two health care companies and the Texas Association of Health Plans.' },
    { id: 'Ky Ash', group: 'Lobbyists', img: 'k_ash', desc: 'Lobbyist and Gov. Greg Abbott\'s former budget director. Ash lobbied for United Healthcare from 2016 to 2017.' },
    { id: 'Mike McKinney', group: 'Lobbyists', img: 'm_mckinney', desc: 'Former House member and friend of Gov. Rick Perry. Health commissioner from 1995 to 1998, then Centene Corp. executive and lobbyist from 1998 to 2001. Hired as Perry’s chief of staff in 2001, McKinney left the following year and later held several executive positions at Centene.' },
    { id: 'Albert Hawkins', group: 'Lobbyists', img: 'a_hawkins', desc: 'Former health commissioner who left that post in 2009. A former lobbyist for Centene Corp., he now lobbies for MCNA Dental, where he\'s also vice chair of the company\'s board of directors.' },
    { id: 'Jim Hine', group: 'Lobbyists', img: 'j_hine', desc: 'Former commissioner of the Department of Aging and Disabilities, which was in charge of health care for vulnerable populations. He left state government in 2006 and registered three years later as a lobbyist for an affiliate of Centene Corp., which owns Superior HealthPlan. He represented Cigna in 2017.' },
    { id: 'Tom Suehs', group: 'Lobbyists', img: 't_suehs', desc: 'Former health commissioner who retired in 2012. He registered the next year as a lobbyist for Amerigroup. He’s also registered as a lobbyist for MCNA Dental.' },
    { id: 'Deirdre Delisi', group: 'Lobbyists', img: 'd_delisi', desc: 'Gov. Rick Perry’s former chief of staff and longtime aide. For the last two years, she has registered as a lobbyist for Anthem, which owns Amerigroup.' },
    { id: 'Daniel Hodge', group: 'Lobbyists', img: 'd_hodge', desc: 'Gov. Greg Abbott’s longtime chief of staff, Hodge left in 2017 and registered as a lobbyist for Aetna three months later.' },
    { id: 'Don Gilbert', group: 'Lobbyists', img: 'd_gilbert', desc: 'A former health commissioner, he left in 2003 and later lobbied for several managed-care organizations, including Aetna and DentaQuest.' },
    { id: 'Chris Traylor', group: 'Lobbyists', img: 'c_traylor', desc: 'Former health commissioner. Left in 2016 and began lobbying for Molina in 2017.' },
  ],
  links: [
    { source: 'Former Gov. Rick Perry', target: 'MCNA Dental' },
    { source: 'Luis Saenz', target: 'Gov. Greg Abbott' },
    { source: 'Luis Saenz', target: 'Former Gov. Rick Perry' },
    { source: 'Luis Saenz', target: UNITED },
    { source: 'Victoria Ford', target: HHSC },
    { source: 'Victoria Ford', target: 'Former Gov. Rick Perry' },
    { source: 'Victoria Ford', target: 'Texas Association of Health Plans' },
    { source: 'Victoria Ford', target: 'Cigna' },
    { source: 'Victoria Ford', target: UNITED },
    { source: 'Mike Toomey', target: 'Former Gov. Rick Perry' },
    { source: 'Mike Toomey', target: 'Cigna' },
    { source: 'Mike Toomey', target: 'Texas Association of Health Plans' },
    { source: 'Mike Toomey', target: UNITED },
    { source: 'Ky Ash', target: 'Gov. Greg Abbott' },
    { source: 'Ky Ash', target: UNITED },
    { source: 'Mike McKinney', target: HHSC },
    { source: 'Mike McKinney', target: 'Former Gov. Rick Perry' },
    { source: 'Mike McKinney', target: 'Centene Corp.' },
    { source: 'Tommy Williams', target: HHSC },
    { source: 'Tommy Williams', target: 'Gov. Greg Abbott' },
    { source: 'Albert Hawkins', target: HHSC },
    { source: 'Albert Hawkins', target: 'Centene Corp.' },
    { source: 'Albert Hawkins', target: 'MCNA Dental' },
    { source: 'Jim Hine', target: HHSC },
    { source: 'Jim Hine', target: 'Centene Corp.' },
    { source: 'Tom Suehs', target: HHSC },
    { source: 'Tom Suehs', target: 'Amerigroup' },
    { source: 'Tom Suehs', target: 'MCNA Dental' },
    { source: 'Deirdre Delisi', target: 'Former Gov. Rick Perry' },
    { source: 'Deirdre Delisi', target: 'Amerigroup' },
    { source: 'Jason Baxter', target: 'Texas Association of Health Plans' },
    { source: 'Jason Baxter', target: 'Tommy Williams' },
    { source: 'Daniel Hodge', target: 'Gov. Greg Abbott' },
    { source: 'Daniel Hodge', target: 'Aetna' },
    { source: 'Don Gilbert', target: HHSC },
    { source: 'Don Gilbert', target: 'Aetna' },
    { source: 'Chris Traylor', target: HHSC },
  ],
};

data.nodes = data.nodes.map(d => Object.assign(d, { active: null }));
data.links = data.links.map(d => Object.assign(d, { active: null }));


export default responsiveRender(() => {
  const svg = d3.select('#revolving-door');

  if (svg.empty()) {
    return;
  }

  svg.selectAll('*').remove();

  const defaultImgSize = window.innerWidth > 750 ? 70 : 45;
  const imgSize = (d) => {
    let size = defaultImgSize;
    if (Object.prototype.hasOwnProperty.call(d, 'size')) {
      size *= d.size;
    }
    if (d.center && !d.org) {
      return defaultImgSize * 1.75;
    }
    if (d.active && !d.org) {
      return defaultImgSize * 1.3;
    }
    return size;
  };

  data.nodes.forEach((d) => {
    let offsetX = 0;
    let offsetY = 0;

    if (d.anchor === 'w') {
      offsetX = (imgSize(d) * -0.5) - 7;
    } else if (d.anchor === 'e') {
      offsetX = (imgSize(d) * 0.5) + 7;
    } else if (d.anchor === 'n') {
      offsetY = (imgSize(d) * d.height * -0.5) - 5;
    } else if (d.anchor === 's') {
      offsetY = (imgSize(d) * d.height * 0.5) + 5;
    }

    Object.assign(d, { offsetX, offsetY });
  });

  const g = svg.append('g');

  if (window.innerWidth < 750) {
    g.attr('width', 635)
      .call(d3.zoom().on('zoom', () => {
        g.attr('transform', d3.event.transform);
      }));
  }

  const width = getWidth(svg.node().parentNode);
  const height = window.innerWidth > 750 ? 550 : 400;

  svg.attr('width', width).attr('height', height);

  const color = d3.scaleOrdinal([
    '#e8e4c5',
    '#a0c7aa',
    '#98beb8',
    '#c6e1e8',
  ]).domain(data.nodes.map(d => d.group));

  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().strength(0.01).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('collission', d3.forceCollide(d => imgSize(d) * 0.5))
    .force('center', d3.forceCenter().x(width / 2).y(height / 2))
    .force('x', d3.forceX().x((d) => {
      let center = width / 2;
      const abbottCenter = center * 0.6;
      const perryCenter = center * 1.4;

      if (d.id === 'Gov. Greg Abbott') {
        return abbottCenter;
      } else if (d.id === 'Former Gov. Rick Perry') {
        return perryCenter;
      }

      // He has both Perry and Abbott links but he's current Abbott
      if (d.id === 'Luis Saenz') {
        return abbottCenter * 0.7;
      }

      if (d.group === 'Lawmakers') {
        data.links.forEach((l) => {
          if (d.id === l.source) {
            if (l.target === 'Gov. Greg Abbott') {
              center = abbottCenter * 0.6;
            } else if (l.target === 'Former Gov. Rick Perry') {
              center = perryCenter;
            }
          }
        });
      }
      return center;
    }).strength((d) => {
      let x = 0;
      switch (d.group) {
        case 'Lawmakers':
          x = 0.25;
          break;
        case HHSC:
          x = 0.1;
          break;
        case 'MCOs':
          x = 0.025;
          break;
        case 'Lobbyists':
          x = 0.005;
          break;
        default:
          // pass
      }
      return x;
    }))
    .force('y', d3.forceY().y((d) => {
      let y = height;
      switch (d.group) {
        case 'Lawmakers':
          y *= 0.05;
          break;
        case 'MCOs':
          y *= 0.3;
          break;
        case 'Lobbyists':
          y *= 0.4;
          break;
        case HHSC:
          y *= 0.75;
          break;
        default:
          // pass
      }
      return y;
    }).strength(0.25));

  const linkOpacity = (d) => {
    if (d.active === true) {
      return 0.8;
    } else if (d.active === null) {
      return 0.5;
    }
    return 0.2;
  };
  const linkWidth = d => d.active ? 2.5 : 1.5;
  const linkColor = d => d.active ? '#848484' : '#c9c9c9';
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('path')
    .data(data.links)
    .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', linkColor)
      .attr('stroke-opacity', linkOpacity)
      .attr('stroke-dasharray', '4,1')
      .attr('stroke-width', linkWidth);
  const nodesG = g.append('g')
    .attr('class', 'nodes');
  const nodeOutlineR = d => imgSize(d) * (d.active ? 0.5 : 0);
  const nodeOutlines = nodesG.selectAll('circle.node-bg')
    .data(data.nodes)
    .enter()
      .append('circle')
      .attr('class', 'node-bg')
      .attr('r', nodeOutlineR)
      .attr('fill', (d) => {
        if (d.org === true) {
          return 'none';
        }
        return color(d.group);
      });
  const nodeOpacity = d => d.active === false ? 0.2 : 1;
  const node = nodesG.selectAll('image')
    .data(data.nodes)
    .enter()
      .append('image')
      .attr('width', d => imgSize(d) * 0.95)
      .attr('height', d => imgSize(d) * 0.95)
      .attr('opacity', nodeOpacity)
      .attr('xlink:href', d => `images/forcemugs/${d.img}-3000.png`);
  const orgDots = nodesG.selectAll('circle.org-dot')
    .data(data.nodes.filter(d => d.org))
    .enter()
      .append('circle')
      .attr('class', 'org-dot')
      .attr('r', 3)
      .attr('fill', linkColor);
  node.on('click', (clicked) => {
    const $chatter = $('#revolving-door-chatter');
    $chatter.empty();
    $chatter.append(`<h5>${clicked.id}</h5>`);
    if (clicked.desc) {
      $chatter.append(`<p>${clicked.desc}</p>`);
    }

    if (clicked.center) {
      data.links.forEach(l => Object.assign(l, { active: null }));
      data.nodes.forEach(l => Object.assign(l, { active: null, center: false }));
      $chatter.empty();
    } else {
      data.links.forEach((l) => {
        if (clicked.id === HHSC && l.source.group === HHSC && l.target.group === HHSC) {
          return;
        }
        const active = clicked.id === l.source.id || clicked.id === l.target.id;
        return Object.assign(l, { active });
      });

      data.nodes.forEach((d) => {
        let active = false;
        let center = false;

        if (d.id === clicked.id) {
          active = true;
          center = true;
        }

        data.links.forEach((l) => {
          if (clicked.id === HHSC && l.source.group === HHSC && l.target.group === HHSC) {
            return;
          }
          if (l.source.id === clicked.id && l.target.id === d.id) {
            active = true;
          } else if (l.target.id === clicked.id && l.source.id === d.id) {
            active = true;
          }
        });

        return Object.assign(d, { active, center });
      });
    }

    nodeOutlines
      .transition()
      .attr('r', nodeOutlineR)
      .attr('fill-opacity', d => d.active ? 1 : 0.6);
    nodeOutlines
      .filter(d => d.id === clicked.id)
      .each((d, i, el) => { d3.select(el[0]).raise(); });
    node
      .transition()
      .attr('width', d => imgSize(d) * 0.95)
      .attr('height', d => imgSize(d) * 0.95)
      .attr('x', d => d.x - (imgSize(d) / 2))
      .attr('y', d => d.y - (imgSize(d) / 2))
      .attr('opacity', nodeOpacity);
    node
      .filter(d => d.id === clicked.id)
      .each((d, i, el) => { d3.select(el[0]).raise(); });
    link
      .transition()
      .attr('stroke-opacity', linkOpacity)
      .attr('stroke-width', linkWidth)
      .attr('stroke', linkColor);
    orgDots
      .transition()
      .attr('r', d => d.active ? 5 : 3)
      .attr('fill', linkColor);
  });

  const linkPath = d3.linkVertical()
    .x(d => d.x + d.offsetX)
    .y(d => d.y + d.offsetY);

  const ticked = () => {
    link
      .attr('d', linkPath);
    node
      .attr('x', d => d.x - (imgSize(d) / 2))
      .attr('y', d => d.y - (imgSize(d) / 2));
    nodeOutlines
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    orgDots
      .attr('cx', d => d.x + d.offsetX)
      .attr('cy', d => d.y + d.offsetY);
  };

  node.append('title').text(d => d.id);

  simulation
    .nodes(data.nodes)
    .on('tick', ticked);

  simulation.force('link')
    .links(data.links);

  $('.revolving-door-start').on('click', () => {
    $('#revolving-door-intro').fadeOut();
    $('.walkthough__revolving-door').removeClass('initial-state');
  });
});
