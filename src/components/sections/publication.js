import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledProject = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  width: 100%;
  max-width: 700px;
  margin-bottom: 100px;

  .project-content {
    ${({ theme }) => theme.mixins.boxShadow};
    padding: 40px;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    color: var(--light-slate);

    .project-overline {
      margin: 10px 0;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 400;
    }

    .project-title {
      color: var(--lightest-slate);
      font-size: clamp(24px, 5vw, 28px);
      margin: 0 0 20px;
    }

    .project-description {
      margin-bottom: 20px;
      font-size: var(--fz-lg);
    }

    .project-tech-list {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
      margin: 25px 0 10px;

      li {
        margin: 0 10px 5px 0;
        color: var(--light-slate);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        white-space: nowrap;
      }
    }

    .project-links {
      display: flex;
      justify-content: center;
      margin-top: 10px;

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 10px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }

      .cta {
        ${({ theme }) => theme.mixins.smallButton};
        margin: 10px;
      }
    }
  }
`;

const ShowMoreButton = styled.button`
  ${({ theme }) => theme.mixins.smallButton};
  margin: 20px auto;
  display: block;
  cursor: pointer;
`;

const Publication = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/publication/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              overline
              title
              tech
              github
              external
              cta
            }
            html
          }
        }
      }
    }
  `);

  // Retrieve all publication nodes
  const allProjects = data.featured.edges.filter(({ node }) => node);
  // State to handle the "more publications" functionality
  const [showMore, setShowMore] = useState(false);
  // Determine which projects to display
  const displayedProjects = showMore ? allProjects : allProjects.slice(0, 2);

  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {return;}
    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  return (
    <section id="publication">
      <h2 className="numbered-heading" ref={revealTitle}>
        Publications
      </h2>

      <StyledProjectsGrid>
        {displayedProjects &&
          displayedProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { overline, external, title, tech, cta } = frontmatter;

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <div className="project-content">
                  <p className="project-overline">{overline}</p>

                  <h3 className="project-title">
                    <a href={external}>{title}</a>
                  </h3>

                  <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

                  {tech.length && (
                    <ul className="project-tech-list">
                      {tech.map((techItem, idx) => (
                        <li key={idx}>{techItem}</li>
                      ))}
                    </ul>
                  )}

                  <div className="project-links">
                    {cta && (
                      <a href={cta} aria-label="Course Link" className="cta">
                        Learn More
                      </a>
                    )}
                    {external && !cta && (
                      <a href={external} aria-label="External Link" className="external">
                        <Icon name="External" />
                      </a>
                    )}
                  </div>
                </div>
              </StyledProject>
            );
          })}
      </StyledProjectsGrid>
      {!showMore && allProjects.length > 2 && (
        <ShowMoreButton onClick={() => setShowMore(true)}>More Publications</ShowMoreButton>
      )}
    </section>
  );
};

export default Publication;
