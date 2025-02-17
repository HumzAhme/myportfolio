import React, { useState, useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledTableContainer = styled.div`
  margin: 100px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: pointer;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
      }
    }

    /* Styles for the expandable detail row */
    .description-row {
      background-color: var(--light-navy);
      td {
        padding: 10px 20px;
        font-size: var(--fz-md);
        color: var(--light-slate);
      }
    }
  }
`;

const ArchivePage = ({ location, data }) => {
  const projects = data.allMarkdownRemark.edges;
  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = index => {
    setExpandedRows(prev => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, [prefersReducedMotion]);

  return (
    <Layout location={location}>
      <Helmet title="Archive" />

      <main>
        <header ref={revealTitle}>
          <h1 className="big-heading">Certifications</h1>
          <p className="subtitle">A big list of Certifications I’ve done</p>
        </header>

        <StyledTableContainer ref={revealTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>License</th>
                <th className="hide-on-mobile">Offered by</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map(({ node }, i) => {
                  const {
                    date,
                    github,
                    external,
                    ios,
                    android,
                    title,
                    bookmark,
                    folder,
                    company,
                  } = node.frontmatter;
                  const { html } = node;
                  // Format the date to show abbreviated month and year
                  const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  });
                  return (
                    <React.Fragment key={i}>
                      <tr onClick={() => toggleRow(i)} ref={el => (revealProjects.current[i] = el)}>
                        <td className="overline year">{formattedDate}</td>
                        <td className="title">{title}</td>
                        <td className="company hide-on-mobile">
                          {company ? <span>{company}</span> : <span>—</span>}
                        </td>
                        <td className="links">
                          <div>
                            {external && (
                              <a href={external} aria-label="External Link">
                                <Icon name="External" />
                              </a>
                            )}
                            {github && (
                              <a href={github} aria-label="GitHub Link">
                                <Icon name="GitHub" />
                              </a>
                            )}

                            {folder && (
                              <a href={folder} aria-label="Folder">
                                <Icon name="Folder" />
                              </a>
                            )}
                            {bookmark && (
                              <a href={bookmark} aria-label="Bookmark">
                                <Icon name="Bookmark" />
                              </a>
                            )}

                            {ios && (
                              <a href={ios} aria-label="Apple App Store Link">
                                <Icon name="AppStore" />
                              </a>
                            )}
                            {android && (
                              <a href={android} aria-label="Google Play Store Link">
                                <Icon name="PlayStore" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedRows[i] && html && (
                        <tr className="description-row">
                          <td colSpan="4" dangerouslySetInnerHTML={{ __html: html }} />
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </StyledTableContainer>
      </main>
    </Layout>
  );
};

ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/certifications/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            date
            title
            github
            external
            ios
            android
            bookmark
            folder
            company
          }
          html
        }
      }
    }
  }
`;
