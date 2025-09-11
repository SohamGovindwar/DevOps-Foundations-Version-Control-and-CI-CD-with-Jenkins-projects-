package com.insured.assurance;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "HelloServlet", urlPatterns = {"/", "/hello"})
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=UTF-8");
        resp.getWriter().println("<html><head><title>Insured Assurance</title></head><body>");
        resp.getWriter().println("<h1>Insured Assurance - Demo App</h1>");
        resp.getWriter().println("<p>Status: deployed successfully.</p>");
        resp.getWriter().println("</body></html>");
    }
}
