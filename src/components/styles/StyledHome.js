import styled from 'styled-components';

const StyledHome = styled.div`
	&.home {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.App-logo {
			height: 170px;
		}

		.login-form {
			background-color: #ffffff;
			width: 300px;
			height: 320px;
			padding: 25px 20px;
			border-radius: 2px;
			-webkit-box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
			-moz-box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
			box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);

			h1 {
				text-align: center;
				text-transform: uppercase;
				color: #42a7eb;
				margin: 0;
			}
		}
		form {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;

			label {
				text-transform: uppercase;
				font-size: 0.875rem;
				color: #666;
			}
			input {
				height: 45px;
				width: 100%;
				margin-bottom: 15px;
				padding-left: 10px;
				border: 2px solid #a4a4a4;
				border-radius: 2px;
				background-color: #dfdfdf;
				font-size: 1.25rem;
				color: #4f4f4f;
			}
			button {
				width: 140px;
				height: 45px;
				background-color: #42a7eb;
				color: #fff;
				text-transform: uppercase;
				align-self: center;
				border-radius: 3px;
				font-weight: bold;
				font-size: 1rem;
				cursor: pointer;
				border: none;

				&:hover {
					background-color: #63bfff;
				}
			}
		}
		.error-msg {
			text-align: center;
			color: red;
			margin-top: 10px;
			font-weight: bold;
		}
	}
`;

export default StyledHome;
