import fs from 'fs/promises';
import fs2 from 'fs';

import path from 'path';
import { promisify } from 'util';
import { glob } from 'glob';

// glob 모듈을 프라미스 방식으로 사용
const globAsync = promisify(glob);

// SCSS 파일들이 있는 디렉토리 경로
const windowsPath = 'C:/work/';

// 파일 패턴 설정
const scssPattern = windowsPath +  '**/*.scss';
console.log(scssPattern)
// class와 id를 저장할 배열
let classList = [];
let idList = [];
const regex = /^[.#]([a-z-_0-9A-Z]+)(?=\>|\s|\{|,|\:|\+|\.|\#|\[)/g;
// SCSS 파일들 찾기
async function findScssFiles() {
	try {
		const files = await glob(scssPattern, { ignore: 'node_modules/**' })
		console.log(files)
		// 각 파일 읽기
		for (const file of files) {
			try {
				const data = await fs.readFile(file, 'utf8');

				// 파일 내용에서 줄 단위로 처리
				const lines = data.split('\n');
				lines.forEach((line) => {
					// 앞뒤 공백 제거
					line = line.trim();

					// 줄이 . 또는 #으로 시작하는지 확인
					if (line.startsWith('.') || line.startsWith('#')) {
						// 공백 이전까지 자르기
						const selector = line.split('{')[0];
						// pattern = read.compile(r'[.#](\S+)(?=\s|\{)')
						//  regex = /^[.#](\S+)(?=\s|\{)/g;
						// console.log(line+'-----')
						let matches = [...line.matchAll(regex)].map(match => match[1]);
						if (matches[0] === undefined) {
							console.log(matches[0] + '====')
							
						} else {

							// .으로 시작하면 classList에 추가
							if (selector.startsWith('.')) {
								classList.push(matches[0]);
							}

							// #으로 시작하면 idList에 추가
							if (selector.startsWith('#')) {
								idList.push(matches[0]);
							}
						}

					}
				});

				// 중복 제거
				classList = [...new Set(classList)];
				idList = [...new Set(idList)];
			} catch (err) {
				console.error('Error reading file:', file, err);
			}
		}

		// 결과 출력
		console.log('Class List:', classList);
		console.log('ID List:', idList);
		saveListsToCSV(classList, idList);

	} catch (err) {
		console.error('Error finding SCSS files:', err);
	}
}

// 함수 실행
findScssFiles();


// CSV 형식으로 변환하는 함수
function convertToCSV(data) {
	console.log(data)
	let a = data.map(row => {
		// console.log(typeof row)
		if (typeof row === "object") {

			return row.join(',')
		}
		else {
			return row
		}
	}).join('\n');
	console.log(a)
	return a
}

function convertToCSV2(list1, list2) {
    const maxLength = Math.max(list1.length, list2.length);
    let csvData = '';
    for (let i = 0; i < maxLength; i++) {
        const valueA = list1[i] || '';
        const valueB = list2[i] || '';
        csvData += `${valueA},${valueB}\n`;
    }
    return csvData;
}

// 클래스 리스트와 아이디 리스트를 CSV 파일로 저장하는 함수
function saveListsToCSV(classList, idList) {
    // const csvData = convertToCSV([[['Class'], ...classList], [['ID'], ...idList]]);
    const csvData = convertToCSV2(classList,idList);
    fs2.writeFileSync('lists.csv', csvData, 'utf8');
    console.log('CSV 파일이 성공적으로 저장되었습니다.');
}