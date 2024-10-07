package com.example.api.controller;

import com.example.api.dto.FeedsDTO;
import com.example.api.dto.PageRequestDTO;
import com.example.api.dto.PageResultDTO;
import com.example.api.service.FeedsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Log4j2
@RequestMapping("/feeds")
@RequiredArgsConstructor
public class FeedsController {
  private final FeedsService feedsService;

  @Value("${com.example.upload.path}")
  private String uploadPath;

  private void typeKeywordInit(PageRequestDTO pageRequestDTO) {
    if (pageRequestDTO.getType().equals("null")) pageRequestDTO.setType("");
    if (pageRequestDTO.getKeyword().equals("null")) pageRequestDTO.setKeyword("");
  }

  @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> list(PageRequestDTO pageRequestDTO) {
    System.out.println("pageRequestDTO: " + pageRequestDTO);
    Map<String, Object> result = new HashMap<>();
    result.put("pageResultDTO", feedsService.getList(pageRequestDTO));
    result.put("pageRequestDTO", pageRequestDTO);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping(value = "/register")
  public ResponseEntity<Long> registerFeed(@RequestBody FeedsDTO feedsDTO) {
    Long fno = feedsService.register(feedsDTO);
    return new ResponseEntity<>(fno, HttpStatus.OK);
  }

  @GetMapping(value = {"/read/{fno}", "/modify/{fno}"}, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, FeedsDTO>> getFeed(
      @PathVariable("fno") Long fno, @RequestBody PageRequestDTO pageRequestDTO) {
    FeedsDTO feedsDTO = feedsService.getFeeds(fno);
    typeKeywordInit(pageRequestDTO);
    Map<String, FeedsDTO> result = new HashMap<>();
    result.put("feedsDTO", feedsDTO);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping(value = "/modify", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, String>> modify(@RequestBody FeedsDTO dto,
                       @RequestBody PageRequestDTO pageRequestDTO) {
    log.info("modify post... dto: " + dto);
    feedsService.modify(dto);
    typeKeywordInit(pageRequestDTO);
    Map<String, String> result = new HashMap<>();
    result.put("msg", dto.getFno() + " 수정");
    result.put("fno", dto.getFno() + "");
    result.put("page", pageRequestDTO.getPage() + "");
    result.put("type", pageRequestDTO.getType());
    result.put("keyword", pageRequestDTO.getKeyword());
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping(value = "/remove/{fno}", produces = MediaType.APPLICATION_JSON_VALUE )
  public ResponseEntity<Map<String, String>> remove(
      @PathVariable Long fno, @RequestBody PageRequestDTO pageRequestDTO) {

    Map<String, String> result = new HashMap<>();
    List<String> photoList = feedsService.removeWithReviewsAndPhotos(fno);
    photoList.forEach(fileName -> {
      try {
        log.info("removeFile............" + fileName);
        String srcFileName = URLDecoder.decode(fileName, "UTF-8");
        File file = new File(uploadPath + File.separator + srcFileName);
        file.delete();
        File thumb = new File(file.getParent(), "s_" + file.getName());
        thumb.delete();
      } catch (Exception e) {
        log.info("remove file : " + e.getMessage());
      }
    });
    if (feedsService.getList(pageRequestDTO).getDtoList().size() == 0 && pageRequestDTO.getPage() != 1) {
      pageRequestDTO.setPage(pageRequestDTO.getPage() - 1);
    }
    typeKeywordInit(pageRequestDTO);
    result.put("msg", fno + " 삭제");
    result.put("page", pageRequestDTO.getPage() + "");
    result.put("type", pageRequestDTO.getType() + "");
    result.put("keyword", pageRequestDTO.getKeyword() + "");
    return new ResponseEntity<>(result, HttpStatus.OK);
  }
}
