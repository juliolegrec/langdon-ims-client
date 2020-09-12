import styled from 'styled-components';

const NavStyles = styled.nav`
	height: 100vh;
	background-color: #161e4c;
	width: 250px;
	color: white;
	overflow: scroll;

	h3 {
		font-size: 1.25rem;
		text-align: center;
		margin-top: 10px;
	}

	li {
		font-weight: 700;
		font-size: 1.1rem;
	}

	.logo-bg {
		width: 125px;
		/* height: 100%; */
		background-color: white;
		border-radius: 2px;
		margin: 15px auto 0;
		padding: 5px;
		display: flex;
		justify-content: center;
		align-items: center;

		img {
			width: 100%;
		}
	}

	.list-group {
		list-style: none;
		margin-top: 40px;
		padding-left: 0;

		a {
			border-top: 1px solid #3a406d;
			color: white;
			text-decoration: none;
			display: block;

			li {
				margin: 20px 0 20px 20px;
			}
			&:last-child {
				border-bottom: 1px solid #3a406d;
			}
		}
		a.current {
			color: #f1c40f;
		}

		.has-submenu {
			cursor: pointer;
			user-select: none;
			padding: 20px 0 20px 20px;
			border-top: 1px solid #3a406d;
			border-bottom: 1px solid #3a406d;

			.MuiSvgIcon-root {
				vertical-align: middle;
				display: inline-block;
			}

			ul {
				display: none;
				margin-top: 10px 0;
				padding: 0;
				/* list-style: none; */

				&.visible {
					display: block;
				}

				a {
					border: none;

					/* li {
						list-style-type: disc;
					} */
				}
			}
		}
	}

	@media only screen and (max-width: 768px) {
		background-color: red;
		display: none;
	}
`;

export default NavStyles;
